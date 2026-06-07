import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OnboardingModal from './OnboardingModal';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  if (!sessionToken) redirect('/login');

  const user = await prisma.user.findFirst({ where: { sessionToken } });
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-0">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 transition-colors">AP Vidhyapith</Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard/profile" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            {user.name ? `Hey, ${user.name}` : 'Profile'}
          </Link>
          <Link href="/login" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            Logout
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>

      {!user.name && <OnboardingModal />}
    </div>
  );
}
