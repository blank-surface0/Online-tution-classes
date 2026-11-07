import React, { useState } from 'react';
import { TuitionProvider, useTuition } from './context/TuitionContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminPortal } from './components/AdminPortal';
import { AuthModals } from './components/AuthModals';
import { StudentSignUpPortal } from './components/StudentSignUpPortal';
import { GraduationCap } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, currentStudent } = useTuition();

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showStudentSwitcher, setShowStudentSwitcher] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation */}
      <Navbar
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenSignUp={() => setShowSignUp(true)}
        onOpenStudentSwitcher={() => setShowStudentSwitcher(true)}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        {role === 'admin' && <AdminPortal />}

        {role === 'student' && currentStudent && <StudentDashboard />}

        {/* If first time visitor (guest) or not yet registered, mandatory sign up gate */}
        {(role === 'guest' || (role === 'student' && !currentStudent)) && (
          <StudentSignUpPortal
            onOpenAdminLogin={() => setShowAdminLogin(true)}
            onOpenStudentSwitcher={() => setShowStudentSwitcher(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Apex Tuition Academy</span>
            <span>• Master Tutor Shakir (shakir.djf7930@gmail.com)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModals
        showAdminLogin={showAdminLogin}
        onCloseAdminLogin={() => setShowAdminLogin(false)}
        showSignUp={showSignUp}
        onCloseSignUp={() => setShowSignUp(false)}
        showStudentSwitcher={showStudentSwitcher}
        onCloseStudentSwitcher={() => setShowStudentSwitcher(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TuitionProvider>
      <MainContent />
    </TuitionProvider>
  );
}
