'use client';

import { useState } from 'react';

type Material = {
  id: string;
  title: string;
  type: string;
  url: string;
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  materials: Material[];
};

export default function CourseClient({ initialCourses }: { initialCourses: Course[] }) {
  const [loading, setLoading] = useState(false);
  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(null);

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>, courseId: string) => {
    e.preventDefault();
    setUploadingCourseId(courseId);
    await new Promise(res => setTimeout(res, 500));
    setUploadingCourseId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this course and all its materials?')) {
      await new Promise(res => setTimeout(res, 500));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Create Course Form */}
      <div className="xl:col-span-1">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Course</h3>
          
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Course Title</label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 12th Science"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Description (optional)</label>
              <textarea
                name="description"
                rows={3}
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Brief description of the course..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>
      </div>

      {/* Courses List */}
      <div className="xl:col-span-2 space-y-6">
        {initialCourses.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            No courses created yet.
          </div>
        ) : (
          initialCourses.map((course) => (
            <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                  {course.description && <p className="text-gray-400 mt-1 text-sm">{course.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete Course
                </button>
              </div>

              {/* Materials List */}
              <div className="bg-gray-900/50 p-6">
                <h4 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Course Materials</h4>
                
                {course.materials.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-6">No materials uploaded yet.</p>
                ) : (
                  <ul className="space-y-3 mb-6">
                    {course.materials.map(mat => (
                      <li key={mat.id} className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${mat.type === 'VIDEO' ? 'bg-blue-900/50 text-blue-400' : 'bg-red-900/50 text-red-400'}`}>
                            {mat.type}
                          </span>
                          <span className="text-gray-200 text-sm font-medium">{mat.title}</span>
                        </div>
                        <a href={mat.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Upload Form */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 border-dashed">
                  <form onSubmit={(e) => handleUpload(e, course.id)} className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Title</label>
                      <input type="text" name="title" required className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. Chapter 1 Video" />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Type</label>
                      <select name="type" className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none">
                        <option value="VIDEO">Video</option>
                        <option value="PDF">PDF Note</option>
                      </select>
                    </div>
                    <div className="flex-1 w-full">
                      <label className="text-xs font-medium text-gray-400 mb-1 block">File</label>
                      <input type="file" name="file" required accept="video/*,application/pdf" className="w-full text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/30 file:text-indigo-400 hover:file:bg-indigo-900/50 transition-colors" />
                    </div>
                    <button type="submit" disabled={uploadingCourseId === course.id} className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50">
                      {uploadingCourseId === course.id ? 'Uploading...' : 'Upload'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
