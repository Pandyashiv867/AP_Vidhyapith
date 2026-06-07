import CourseViewerClient from './CourseViewerClient';
import Link from 'next/link';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = { title: "Mock Course" };
  const materialsWithProgress: any[] = [];

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
