'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function toggleProgress(materialId: string, completed: boolean) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  if (!sessionToken) return { error: 'Not logged in' };

  const user = await prisma.user.findFirst({ where: { sessionToken } });
  if (!user) return { error: 'Invalid session' };

  try {
    await prisma.progress.upsert({
      where: {
        userId_materialId: {
          userId: user.id,
          materialId,
        }
      },
      update: { completed },
      create: {
        userId: user.id,
        materialId,
        completed
      }
    });
    
    // Revalidate multiple paths to ensure UI updates
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/course/[id]`, 'page');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to update progress' };
  }
}
