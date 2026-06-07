export default async function AdminDashboard() {
  const studentCount = 0;
  const courseCount = 0;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white">Welcome back, Admin!</h2>
        <p className="text-gray-400 mt-2">Here is what's happening on your platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Stat Card 1 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Students</h3>
          <p className="text-4xl font-bold text-white mt-2">{studentCount}</p>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Active Courses</h3>
          <p className="text-4xl font-bold text-white mt-2">{courseCount}</p>
        </div>
      </div>
    </div>
  );
}
