import React, { useState, useEffect } from 'react';
import { Users, Save, Share2, Clock, CheckCircle2 } from 'lucide-react';
import { mockDb } from '../services/mockFirebase';
import { Note } from '../types';

export const CollaborativeNotes: React.FC = () => {
  const [noteContent, setNoteContent] = useState('');
  const [title, setTitle] = useState('Untitled Project Notes');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  
  // Simulated collaborators
  const collaborators = [
    { name: 'Sarah Chen', color: 'bg-emerald-500', initials: 'SC' },
    { name: 'Marcus Jo', color: 'bg-amber-500', initials: 'MJ' },
    { name: 'You', color: 'bg-indigo-600', initials: 'ME' },
  ];

  // Simulating "other user" activity
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    // Randomly show "Sarah is typing..."
    const interval = setInterval(() => {
      const show = Math.random() > 0.7;
      if (show) {
        setActiveNotification('Sarah Chen is editing...');
        setTimeout(() => setActiveNotification(null), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    
    const note: Note = {
      id: 'demo-note',
      title,
      content: noteContent,
      collaborators: collaborators.map(c => c.name),
      lastUpdated: Date.now()
    };
    await mockDb.saveNote(note);
    
    setLastSaved(Date.now());
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
           <input 
             type="text" 
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="text-2xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-300 w-full md:w-auto"
           />
           <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
             <Clock size={12} />
             <span>{lastSaved ? `Last saved at ${new Date(lastSaved).toLocaleTimeString()}` : 'Unsaved changes'}</span>
             {isSaving && <span className="text-indigo-600 font-medium">Saving...</span>}
           </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {collaborators.map((c, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-bold border-2 border-white ring-1 ring-slate-100 shadow-sm`}
                title={c.name}
              >
                {c.initials}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border-2 border-white hover:bg-slate-200 transition-colors">
              <Users size={14} />
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <button 
             onClick={handleSave}
             className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex relative">
         {/* Main Editor Area */}
         <textarea
           className="flex-1 w-full h-full p-8 outline-none resize-none text-slate-700 leading-relaxed font-serif text-lg"
           placeholder="Start typing your collaborative notes here..."
           value={noteContent}
           onChange={(e) => setNoteContent(e.target.value)}
         />
         
         {/* Collaborative Activity Toast */}
         {activeNotification && (
           <div className="absolute bottom-4 left-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce-short">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
             <span>{activeNotification}</span>
           </div>
         )}
      </div>
    </div>
  );
};