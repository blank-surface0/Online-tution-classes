import React, { useState } from 'react';
import { useTuition } from '../context/TuitionContext';
import {
  GraduationCap,
  UserPlus,
  Shield,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Phone,
  Mail,
  Users,
} from 'lucide-react';

interface StudentSignUpPortalProps {
  onOpenAdminLogin: () => void;
  onOpenStudentSwitcher: () => void;
}

export const StudentSignUpPortal: React.FC<StudentSignUpPortalProps> = ({
  onOpenAdminLogin,
  onOpenStudentSwitcher,
}) => {
  const { signUpStudent, students, liveClasses } = useTuition();

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
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const availableSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Computer Science',
  ];

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!grade.trim()) {
      setErrorMessage('Please select your class / grade.');
      return;
    }
    if (!dateOfBirth) {
      setErrorMessage('Please provide your date of birth.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter student phone number.');
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMessage('Please enter parent/guardian phone number.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setErrorMessage('Please choose at least one tuition subject.');
      return;
    }

    setSubmitting(true);

    try {
      signUpStudent({
        name: name.trim(),
        grade: grade.trim(),
        dateOfBirth: dateOfBirth,
        email: email.trim(),
        phone: phone.trim(),
        parentPhone: parentPhone.trim(),
        batch: batch,
        subjects: selectedSubjects,
        notes: 'Enrolled via first-time student registration portal.',
      });
    } catch {
      setErrorMessage('Failed to complete enrollment. Please verify your details.');
      setSubmitting(false);
    }
  };

  const activeLiveClass = liveClasses.find((l) => l.isLiveNow);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Student Admission Required</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Welcome to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">
            Apex Tuition Academy
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          To access your personalized student dashboard, live classes, attendance tracker, and coursework with Master Tutor Shakir, please complete your registration below.
        </p>

        {activeLiveClass && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Class in Session: {activeLiveClass.title} ({activeLiveClass.subject})</span>
          </div>
        )}
      </div>

      {/* Registration Card Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student Registration Form</h2>
              <p className="text-xs text-slate-400">All fields are required to open your student dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="text-xs text-slate-400 hover:text-amber-400 font-medium flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl transition"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Name & Class/Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Farhan Akhtar"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Class / Grade <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="Grade 9">Grade 9 (Secondary)</option>
                <option value="Grade 10">Grade 10 (Secondary / Board)</option>
                <option value="Grade 11">Grade 11 (Higher Secondary)</option>
                <option value="Grade 12">Grade 12 (Board / Entrance)</option>
              </select>
            </div>
          </div>

          {/* 2. Date of Birth & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date of Birth <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max="2020-01-01"
                min="1995-01-01"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email Address <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* 3. Phone & Parent Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student Phone Number <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Parent / Guardian Phone <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="tel"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91 98765 11111"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* 4. Tuition Batch */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Select Tuition Batch <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Morning Elite Batch', label: 'Morning Elite Batch', time: '7:00 AM - 8:30 AM' },
                { id: 'Evening Foundation Batch', label: 'Evening Foundation Batch', time: '5:30 PM - 7:00 PM' },
                { id: 'Weekend Booster Batch', label: 'Weekend Booster Batch', time: 'Sat & Sun (Flexible)' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBatch(b.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    batch === b.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-100">{b.label}</div>
                  <div className="text-[10px] text-indigo-300 mt-0.5">{b.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Subjects Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Subjects of Interest (Select all that apply) <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : null}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Registering & Loading Dashboard...' : 'Submit Registration & Open My Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Existing Students Fast Login */}
        {students.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>Already enrolled in tuition classes?</span>
            <button
              type="button"
              onClick={onOpenStudentSwitcher}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Select Your Student Profile &rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
