import CourseClient from './CourseClient';

export default async function CoursesPage() {
  const courses: any[] = [];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Courses</h2>
          <p className="text-gray-400 mt-1">Create courses and upload Video/PDF materials.</p>
        </div>
      </header>
      
      <CourseClient initialCourses={courses} />
    </div>
  );
}
