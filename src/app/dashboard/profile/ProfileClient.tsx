'use client';

import { useState } from 'react';

export default function ProfileClient({ initialName }: { initialName: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    await new Promise((res) => setTimeout(res, 500));
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-300">Full Name</label>
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          required
          className="mt-2 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Your full name"
        />
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'error' ? 'bg-red-900/30 text-red-400 border-red-900/50' : 'bg-green-900/30 text-green-400 border-green-900/50'}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
}
