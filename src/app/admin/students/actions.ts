'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createStudent(formData: FormData) {
  const mobileNumber = formData.get('mobileNumber') as string;
  const password = formData.get('password') as string;

  if (!mobileNumber || !password) {
    return { error: 'Mobile number and password are required' };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { mobileNumber } });
    if (existing) {
      return { error: 'User with this mobile number already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        mobileNumber,
        passwordHash,
        role: 'STUDENT',
      }
    });

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create student' };
  }
}

export async function unlockDevice(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentDeviceId: null,
        sessionToken: null,
      }
    });
    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to unlock device' };
  }
}

export async function deleteStudent(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete student' };
  }
}
