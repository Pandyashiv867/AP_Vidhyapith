'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string;
  
  if (!name || name.trim() === '') {
    return { error: 'Name is required' };
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  if (!sessionToken) return { error: 'Not authenticated' };

  try {
    const user = await prisma.user.findFirst({ where: { sessionToken } });
    if (!user) return { error: 'Not authenticated' };

    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() }
    });

    revalidatePath('/dashboard', 'layout');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to update profile' };
  }
}
