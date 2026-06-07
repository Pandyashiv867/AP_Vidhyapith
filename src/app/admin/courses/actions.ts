'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createCourse(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) return { error: 'Course title is required' };

  try {
    await prisma.course.create({
      data: { title, description }
    });
    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create course' };
  }
}

export async function uploadMaterial(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const type = formData.get('type') as string; // 'VIDEO' or 'PDF'
  const file = formData.get('file') as File;

  if (!file || !courseId || !title || !type) {
    return { error: 'All fields are required' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {}

    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = join(uploadsDir, uniqueFilename);
    
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    await prisma.material.create({
      data: {
        title,
        type,
        url: fileUrl,
        courseId
      }
    });

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to upload material' };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({ where: { id: courseId } });
    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete course' };
  }
}
