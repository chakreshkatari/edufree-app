import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SummaryGenerator } from './components/SummaryGenerator';
import { CollaborativeNotes } from './components/CollaborativeNotes';
import { ResourceLibrary } from './components/ResourceLibrary';
import { mockAuth } from './services/mockFirebase';
import { User, ViewState } from './types';
import { ArrowRight, Sparkles, Shield, Users } from 'lucide-react';

const Dashboard: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
    <div className="text-center space-y-8 max-w-3xl mx-auto">
      <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
        <Sparkles size={16} />
        <span>Powered by Google Gemini</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Master your studies with <span className="text-indigo-600">AI-Powered</span> tools.
      </h1>
      <p className="text-xl text-slate-600 leading-relaxed">
        Eliminate search fatigue. Generate summaries instantly, take collaborative notes, and find the best free resources tailored to your curriculum.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button 
          onClick={() => onNavigate(ViewState.SUMMARY)}
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
        >
          <span>Get Started</span>
          <ArrowRight size={20} />
        </button>
        <button 
          onClick={() => onNavigate(ViewState.RESOURCES)}
          className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
        >
          Browse Library
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { 
          icon: <Sparkles className="text-amber-500" size={32} />, 
          title: "AI Summarizer", 
          desc: "Upload chapters and get concise, study-ready summaries in seconds." 
        },
        { 
          icon: <Users className="text-blue-500" size={32} />, 
          title: "Collab Notes", 
          desc: "Real-time note taking with your study group. Syncs across devices." 
        },
        { 
          icon: <Shield className="text-emerald-500" size={32} />, 
          title: "Verified Resources", 
          desc: "Community rated content. Only the best for your education." 
        }
      ].map((feature, idx) => (
        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for auth state
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      const loggedUser = await mockAuth.signIn();
      setUser(loggedUser);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = async () => {
    await mockAuth.signOut();
    setUser(null);
    setView(ViewState.HOME);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600">
         <Sparkles className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        currentView={view} 
        onNavigate={setView} 
        user={user} 
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {view === ViewState.HOME && <Dashboard onNavigate={setView} />}
        {view === ViewState.SUMMARY && <SummaryGenerator />}
        {view === ViewState.NOTES && <CollaborativeNotes />}
        {view === ViewState.RESOURCES && <ResourceLibrary />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} EduFree. Powered by Google Gemini. Demo Version.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;