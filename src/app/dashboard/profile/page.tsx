import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  if (!sessionToken) redirect('/login');

  const user = await prisma.user.findFirst({ where: { sessionToken } });
  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-white">Your Profile</h2>
        <p className="text-gray-400 mt-2">Manage your personal information.</p>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Mobile Number</p>
          <p className="text-xl font-medium text-white">{user.mobileNumber}</p>
          <p className="text-xs text-gray-500 mt-2">Your mobile number is used to log in and cannot be changed.</p>
        </div>
        
        <ProfileClient initialName={user.name || ''} />
      </div>
    </div>
  );
}
