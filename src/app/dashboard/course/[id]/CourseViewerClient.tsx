'use client';

import { useState, useTransition } from 'react';

type Material = {
  id: string;
  title: string;
  type: string;
  url: string;
  completed: boolean;
};

export default function CourseViewerClient({ materials: initialMaterials }: { materials: Material[] }) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(materials[0] || null);
  const [isPending, startTransition] = useTransition();

  if (materials.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-500">No materials available for this course.</p>
      </div>
    );
  }

  const handleToggleComplete = () => {
    if (!activeMaterial) return;
    const newStatus = !activeMaterial.completed;
    
    // Optimistic update
    setMaterials(prev => prev.map(m => m.id === activeMaterial.id ? { ...m, completed: newStatus } : m));
    setActiveMaterial({ ...activeMaterial, completed: newStatus });

    // Mock server update
    startTransition(async () => {
      await new Promise(res => setTimeout(res, 500));
    });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-[600px] overflow-hidden">
      {/* Sidebar Playlist */}
      <div className="w-full lg:w-80 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-gray-800 bg-gray-800/30">
          <h3 className="font-semibold text-white">Course Content</h3>
          <p className="text-xs text-gray-400 mt-1">{materials.filter(m => m.completed).length} of {materials.length} completed</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {materials.map((mat, index) => {
            const isActive = activeMaterial?.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setActiveMaterial(mat)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
              >
                <div className={`w-6 flex justify-center text-xs font-bold ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {mat.completed ? <span className="text-green-400">✓</span> : index + 1}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{mat.title}</p>
                  <p className={`text-[10px] uppercase font-bold mt-0.5 ${isActive ? 'text-indigo-300' : 'text-gray-500'}`}>{mat.type}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
        {activeMaterial ? (
          <>
            <div className="flex-1 relative">
              {activeMaterial.type === 'VIDEO' ? (
                <video 
                  key={activeMaterial.url}
                  controls 
                  controlsList="nodownload"
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                >
                  <source src={activeMaterial.url} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe 
                  src={`${activeMaterial.url}#toolbar=0`} 
                  className="absolute inset-0 w-full h-full bg-white"
                  title={activeMaterial.title}
                />
              )}
            </div>
            <div className="p-6 bg-gray-900 border-t border-gray-800 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{activeMaterial.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{activeMaterial.type === 'VIDEO' ? 'Video Lesson' : 'PDF Document'}</p>
              </div>
              <button 
                onClick={handleToggleComplete}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeMaterial.completed 
                    ? 'bg-green-900/40 text-green-400 border border-green-800/50 hover:bg-green-900/60'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {activeMaterial.completed ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
