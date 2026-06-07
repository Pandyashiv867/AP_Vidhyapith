'use client';

import { useState } from 'react';
import { createStudent, unlockDevice, deleteStudent } from './actions';

type Student = {
  id: string;
  mobileNumber: string;
  name: string | null;
  currentDeviceId: string | null;
  createdAt: Date;
};

export default function StudentClient({ initialStudents }: { initialStudents: Student[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const res = await createStudent(formData);
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
    // Form will reset naturally if we don't preventDefault, but we did. 
    // Wait, with server actions in form `action={handleCreate}`, it handles it automatically.
  };

  const handleUnlock = async (id: string) => {
    if (confirm('Are you sure you want to unlock this user? This will log them out of their current device.')) {
      await unlockDevice(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student entirely?')) {
      await deleteStudent(id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Create Student Form */}
      <div className="lg:col-span-1">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Student</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form action={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                required
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 9876543210"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input
                type="text"
                name="password"
                required
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Default password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </form>
        </div>
      </div>

      {/* Student List */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800/50 text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Mobile Number</th>
                  <th className="px-6 py-4 font-medium">Device Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {initialStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No students added yet.
                    </td>
                  </tr>
                ) : (
                  initialStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-200">
                        {student.name || <span className="italic text-gray-500">No name set</span>} <br/>
                        <span className="text-xs text-gray-400 font-normal">{student.mobileNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        {student.currentDeviceId ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                            Locked to Device
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                            Not Locked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleUnlock(student.id)}
                          disabled={!student.currentDeviceId}
                          className="text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          Unlock
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-400 hover:text-red-300 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
