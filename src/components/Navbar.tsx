import React, { useState } from 'react';
import { useTuition } from '../context/TuitionContext';
import {
  GraduationCap,
  Shield,
  UserCheck,
  Radio,
  LogOut,
  UserPlus,
  KeyRound,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenSignUp: () => void;
  onOpenStudentSwitcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  onOpenSignUp,
  onOpenStudentSwitcher,
}) => {
  const {
    role,
    setRole,
    currentStudent,
    isAdminAuthenticated,
    logout,
    liveClasses,
  } = useTuition();

  const activeLiveClass = liveClasses.find((l) => l.isLiveNow);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Live class alert bar if any class is currently live */}
      {activeLiveClass && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-medium text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 mx-auto max-w-7xl w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
              Live Class in Session
            </span>
            <span className="truncate font-semibold">{activeLiveClass.title}</span>
            <span className="text-white/80 hidden sm:inline">({activeLiveClass.subject} • {activeLiveClass.batch})</span>
            <a
              href={activeLiveClass.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 bg-white text-emerald-800 px-2.5 py-0.5 rounded font-bold hover:bg-emerald-50 transition text-[11px] shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
              Join Class Now
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                Apex Tuition Academy
              </span>
              <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full hidden md:inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> Online Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tutoring by Master Tutor Shakir
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>

            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setRole('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
              {isAdminAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>
          </div>

          {/* User Status / Actions */}
          {role === 'guest' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSignUp}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Student Sign Up</span>
              </button>
            </div>
          )}

          {role === 'student' && currentStudent && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenStudentSwitcher}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-slate-200 transition"
                title="Change active student profile"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[11px] border border-indigo-500/30">
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-slate-100 leading-tight">
                    {currentStudent.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none">
                    {currentStudent.grade}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={onOpenSignUp}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1"
                title="Register a new student"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
              </button>
            </div>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin: Shakir</span>
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-400 p-2 rounded-lg transition"
                title="Log out of Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
