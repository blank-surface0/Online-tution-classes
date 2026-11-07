import React, { useState } from 'react';
import { useTuition } from '../context/TuitionContext';
import {
  Shield,
  Lock,
  KeyRound,
  X,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
} from 'lucide-react';

interface AuthModalsProps {
  showAdminLogin: boolean;
  onCloseAdminLogin: () => void;
  showSignUp: boolean;
  onCloseSignUp: () => void;
  showStudentSwitcher: boolean;
  onCloseStudentSwitcher: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  showAdminLogin,
  onCloseAdminLogin,
  showSignUp,
  onCloseSignUp,
  showStudentSwitcher,
  onCloseStudentSwitcher,
}) => {
  const {
    loginAdmin,
    signUpStudent,
    loginStudent,
    students,
    currentStudent,
  } = useTuition();

  // Admin Login state
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Student Sign Up state
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 11');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [batch, setBatch] = useState('Morning Elite Batch');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'Physics',
  ]);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const availableSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Computer Science',
  ];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = loginAdmin(adminPassword);
    if (success) {
      setAdminPassword('');
      onCloseAdminLogin();
    } else {
      setAdminError('Incorrect admin password. Please try again.');
    }
  };

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    signUpStudent({
      name: name.trim(),
      grade,
      dateOfBirth,
      email: email.trim(),
      phone: phone.trim() || '+91 98000 00000',
      parentPhone: parentPhone.trim() || '+91 98000 00001',
      batch,
      subjects: selectedSubjects,
    });

    setSignUpSuccess(true);
    setTimeout(() => {
      setSignUpSuccess(false);
      setName('');
      setDateOfBirth('');
      setEmail('');
      setPhone('');
      setParentPhone('');
      onCloseSignUp();
    }, 1200);
  };

  return (
    <>
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={onCloseAdminLogin}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Portal Access</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your master credentials to manage students, materials, attendance, and live classes.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Master Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              {adminError && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Unlock Admin Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={onCloseSignUp}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Student Registration</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enroll in Apex Tuition Academy for live interactive classes, assignments, and personalized progress tracking.
              </p>
            </div>

            {signUpSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-white">Enrollment Successful!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Welcome to Apex Tuition. Loading your student dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Farhan Akhtar"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Grade / Class *
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10 (Secondary)</option>
                      <option value="Grade 11">Grade 11 (Higher Secondary)</option>
                      <option value="Grade 12">Grade 12 (Board / Entrance)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Parent / Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 98765 11111"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tuition Batch
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Morning Elite Batch">Morning Elite Batch (7:00 AM)</option>
                    <option value="Evening Foundation Batch">Evening Foundation Batch (5:30 PM)</option>
                    <option value="Weekend Booster Batch">Weekend Booster Batch (Sat & Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subjects Enrolled (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSubjects.map((sub) => {
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20"
                  >
                    Complete Sign Up & Open Dashboard
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Student Switcher Modal */}
      {showStudentSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={onCloseStudentSwitcher}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-slate-700">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Select Student Profile</h3>
              <p className="text-xs text-slate-400">
                Switch perspective to inspect individual student coursework and attendance.
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {students.map((student) => {
                const isCurrent = currentStudent?.id === student.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => {
                      loginStudent(student.id);
                      onCloseStudentSwitcher();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 border border-slate-600">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {student.grade} • {student.batch}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onCloseStudentSwitcher();
                  onCloseAdminLogin();
                  // open sign up
                }}
                className="w-full text-xs text-slate-400 hover:text-indigo-400 text-center font-medium transition py-1"
              >
                + Register another student
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
