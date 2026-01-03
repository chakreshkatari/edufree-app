import React from 'react';
import { ViewState, User } from '../types';
import { BookOpen, FileText, Search, User as UserIcon, LogOut, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, onLogin, onLogout }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
        ${currentView === view 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(ViewState.HOME)}>
            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              EduFree
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <NavItem view={ViewState.SUMMARY} icon={FileText} label="AI Summarizer" />
            <NavItem view={ViewState.NOTES} icon={BookOpen} label="Collab Notes" />
            <NavItem view={ViewState.RESOURCES} icon={Search} label="Smart Library" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-800">{user.displayName}</span>
                  <span className="text-xs text-slate-500">Student</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="h-9 w-9 rounded-full ring-2 ring-indigo-100" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {user.displayName.charAt(0)}
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
              >
                <UserIcon size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-around p-2 border-t border-slate-100 bg-white">
          <button onClick={() => onNavigate(ViewState.SUMMARY)} className={`p-2 ${currentView === ViewState.SUMMARY ? 'text-indigo-600' : 'text-slate-400'}`}><FileText size={24} /></button>
          <button onClick={() => onNavigate(ViewState.NOTES)} className={`p-2 ${currentView === ViewState.NOTES ? 'text-indigo-600' : 'text-slate-400'}`}><BookOpen size={24} /></button>
          <button onClick={() => onNavigate(ViewState.RESOURCES)} className={`p-2 ${currentView === ViewState.RESOURCES ? 'text-indigo-600' : 'text-slate-400'}`}><Search size={24} /></button>
      </div>
    </nav>
  );
};