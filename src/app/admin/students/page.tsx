import { prisma } from '@/lib/prisma';
import StudentClient from './StudentClient';

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      mobileNumber: true,
      name: true,
      currentDeviceId: true,
      createdAt: true,
    }
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Students</h2>
          <p className="text-gray-400 mt-1">Create accounts and manage device access.</p>
        </div>
      </header>
      
      <StudentClient initialStudents={students} />
    </div>
  );
}
