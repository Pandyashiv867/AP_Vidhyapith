export default async function AnalyticsPage() {
  const students: any[] = [];
  const totalMaterials = 0;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white">Student Analytics</h2>
        <p className="text-gray-400 mt-2">Track the progress of your students across all courses.</p>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-800/50 text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Student Mobile</th>
                <th className="px-6 py-4 font-medium">Total Progress</th>
                <th className="px-6 py-4 font-medium">Recently Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No students registered yet.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const completedCount = student.progress.length;
                  const percentage = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;
                  
                  // Sort progress to get latest
                  const latestProgress = [...student.progress].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

                  return (
                    <tr key={student.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-200">
                        {student.name || <span className="italic text-gray-500">No name set</span>} <br/>
                        <span className="text-xs text-gray-400 font-normal">{student.mobileNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-full max-w-[150px] bg-gray-800 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-500 h-1.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-indigo-400">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {latestProgress ? (
                          <span>
                            <strong className="text-gray-300">{latestProgress.material.title}</strong> 
                            <span className="text-gray-600 mx-1">•</span> 
                            {latestProgress.material.course.title}
                          </span>
                        ) : (
                          <span className="text-gray-600 italic">No progress yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
