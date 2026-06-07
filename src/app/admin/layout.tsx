import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-500">AP Vidhyapith</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="block px-4 py-3 rounded-lg bg-gray-800 text-gray-100 hover:bg-gray-700 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/students" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
            Manage Students
          </Link>
          <Link href="/admin/courses" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
            Manage Courses
          </Link>
          <Link href="/admin/analytics" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
            Student Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/login" className="block w-full text-center px-4 py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900/80 transition-colors">
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
