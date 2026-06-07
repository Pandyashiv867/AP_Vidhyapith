import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const user = sessionToken ? await prisma.user.findFirst({ where: { sessionToken } }) : null;

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      materials: {
        select: {
          id: true,
          progress: user ? { where: { userId: user.id } } : false
        }
      }
    }
  });

  const coursesWithProgress = courses.map(course => {
    const totalMaterials = course.materials.length;
    const completedMaterials = course.materials.filter(m => m.progress?.[0]?.completed).length;
    const progressPercentage = totalMaterials === 0 ? 0 : Math.round((completedMaterials / totalMaterials) * 100);

    return { ...course, totalMaterials, completedMaterials, progressPercentage };
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white">Your Courses</h2>
        <p className="text-gray-400 mt-2">Select a course to pick up right where you left off.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesWithProgress.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-gray-500">No courses available yet.</p>
          </div>
        ) : (
          coursesWithProgress.map(course => (
            <Link key={course.id} href={`/dashboard/course/${course.id}`} className="group block bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all transform hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-gray-900 p-6 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors relative z-10">{course.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-sm line-clamp-2">{course.description || "No description provided."}</p>
                
                {/* Progress Bar Area */}
                <div className="mt-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                    <span className="text-xs font-bold text-indigo-400">{course.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${course.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 text-right">
                    {course.completedMaterials} of {course.totalMaterials} materials completed
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
