import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CourseViewerClient from './CourseViewerClient';
import Link from 'next/link';

import { cookies } from 'next/headers';

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const user = sessionToken ? await prisma.user.findFirst({ where: { sessionToken } }) : null;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      materials: { 
        orderBy: { createdAt: 'asc' },
        include: {
          progress: user ? { where: { userId: user.id } } : false
        }
      }
    }
  });

  if (!course) notFound();

  const materialsWithProgress = course.materials.map(m => ({
    id: m.id,
    title: m.title,
    type: m.type,
    url: m.url,
    completed: m.progress?.[0]?.completed || false
  }));

  return (
    <div className="h-full flex flex-col space-y-4">
      <header className="flex items-center space-x-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Courses
        </Link>
        <h2 className="text-2xl font-bold text-white pl-4 border-l border-gray-700">{course.title}</h2>
      </header>

      <CourseViewerClient materials={materialsWithProgress} />
    </div>
  );
}
