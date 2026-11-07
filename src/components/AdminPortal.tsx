import React, { useState } from 'react';
import { useTuition } from '../context/TuitionContext';
import {
  calculateAttendanceRate,
  calculateStudentProgress,
} from '../utils/academicLogic';
import {
  Users,
  CalendarCheck,
  Video,
  FileText,
  Award,
  Radio,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Shield,
  Send,
  UploadCloud,
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Student, Material, Assignment, Quiz, AttendanceRecord, LiveClassNotification } from '../types';

export const AdminPortal: React.FC = () => {
  const {
    students,
    materials,
    assignments,
    submissions,
    quizzes,
    quizAttempts,
    attendance,
    liveClasses,
    doubts,
    addStudent,
    updateStudent,
    deleteStudent,
    addMaterial,
    deleteMaterial,
    addAssignment,
    deleteAssignment,
    gradeSubmission,
    addQuiz,
    deleteQuiz,
    markAttendanceBatch,
    updateAttendanceSingle,
    addLiveClass,
    deleteLiveClass,
    toggleLiveNow,
    replyToDoubt,
  } = useTuition();

  const [adminTab, setAdminTab] = useState<
    'students' | 'attendance' | 'materials' | 'assignments' | 'quizzes' | 'live' | 'doubts'
  >('students');

  // Search & Filter state
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');

  // Add Student modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 11');
  const [newStudentBatch, setNewStudentBatch] = useState('Morning Elite Batch');
  const [newStudentSubjects, setNewStudentSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [newStudentNotes, setNewStudentNotes] = useState('');

  // Add Material modal
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatSubject, setNewMatSubject] = useState('Mathematics');
  const [newMatTopic, setNewMatTopic] = useState('');
  const [newMatType, setNewMatType] = useState<'video' | 'pdf' | 'notes'>('video');
  const [newMatVideoUrl, setNewMatVideoUrl] = useState('');
  const [newMatFileUrl, setNewMatFileUrl] = useState('');
  const [newMatContent, setNewMatContent] = useState('');
  const [newMatDuration, setNewMatDuration] = useState('30 mins');

  // Add Assignment modal
  const [showAddAsgModal, setShowAddAsgModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState('Mathematics');
  const [newAsgDescription, setNewAsgDescription] = useState('');
  const [newAsgDueDate, setNewAsgDueDate] = useState('2026-11-20');
  const [newAsgTotalMarks, setNewAsgTotalMarks] = useState(50);

  // Grading state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(45);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');
  const [aiGradingLoading, setAiGradingLoading] = useState(false);

  // Add Quiz modal (Manual or AI)
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [quizMode, setQuizMode] = useState<'ai' | 'manual'>('ai');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState('Mathematics');
  const [newQuizTopic, setNewQuizTopic] = useState('Calculus');
  const [newQuizMinutes, setNewQuizMinutes] = useState(15);
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [aiQuizError, setAiQuizError] = useState('');

  // Attendance Tracker state
  const [attendanceDate, setAttendanceDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [attendanceBatch, setAttendanceBatch] = useState<string>('All');

  // Add Live Class modal
  const [showAddLiveModal, setShowAddLiveModal] = useState(false);
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveSubject, setNewLiveSubject] = useState('Mathematics');
  const [newLiveBatch, setNewLiveBatch] = useState('Morning Elite Batch');
  const [newLiveStartTime, setNewLiveStartTime] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [newLiveDuration, setNewLiveDuration] = useState(60);
  const [newLiveUrl, setNewLiveUrl] = useState('https://meet.google.com/xyz-tuition-room');
  const [newLiveNotes, setNewLiveNotes] = useState('');

  // Doubt Reply state
  const [activeReplyingDoubtId, setActiveReplyingDoubtId] = useState<string | null>(null);
  const [doubtReplyText, setDoubtReplyText] = useState('');

  // AI Student Progress Review
  const [selectedStudentForAI, setSelectedStudentForAI] = useState<Student | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchStudent.toLowerCase());
    const matchBatch =
      selectedBatchFilter === 'All' || s.batch === selectedBatchFilter;
    return matchSearch && matchBatch;
  });

  // Calculate Overall Tuition Metrics
  const totalStudents = students.length;
  const allAttendanceRates = students.map((s) => calculateAttendanceRate(attendance, s.id).rate);
  const avgAttendance =
    allAttendanceRates.length > 0
      ? Math.round(allAttendanceRates.reduce((a, b) => a + b, 0) / allAttendanceRates.length)
      : 90;
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted').length;
  const pendingDoubts = doubts.filter((d) => d.status === 'pending').length;

  // Handlers
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    addStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      phone: newStudentPhone.trim() || '+91 98000 00000',
      parentPhone: newStudentParentPhone.trim() || '+91 98000 00001',
      grade: newStudentGrade,
      batch: newStudentBatch,
      subjects: newStudentSubjects,
      notes: newStudentNotes.trim() || 'Newly admitted tuition student.',
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentParentPhone('');
    setNewStudentNotes('');
    setShowAddStudentModal(false);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    addMaterial({
      title: newMatTitle.trim(),
      subject: newMatSubject,
      topic: newMatTopic.trim() || 'General Curriculum',
      type: newMatType,
      videoUrl: newMatVideoUrl.trim() || undefined,
      fileUrl: newMatFileUrl.trim() || undefined,
      content: newMatContent.trim(),
      duration: newMatDuration,
      authorName: 'Master Tutor Shakir',
    });

    setNewMatTitle('');
    setNewMatTopic('');
    setNewMatVideoUrl('');
    setNewMatFileUrl('');
    setNewMatContent('');
    setShowAddMaterialModal(false);
  };

  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    addAssignment({
      title: newAsgTitle.trim(),
      subject: newAsgSubject,
      description: newAsgDescription.trim(),
      dueDate: newAsgDueDate,
      totalMarks: Number(newAsgTotalMarks) || 50,
      status: 'active',
    });

    setNewAsgTitle('');
    setNewAsgDescription('');
    setShowAddAsgModal(false);
  };

  const handleAddLiveClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveTitle.trim()) return;

    addLiveClass({
      title: newLiveTitle.trim(),
      subject: newLiveSubject,
      batch: newLiveBatch,
      startTime: new Date(newLiveStartTime).toISOString(),
      durationMinutes: Number(newLiveDuration) || 60,
      joinUrl: newLiveUrl.trim() || 'https://meet.google.com/xyz-tuition-room',
      instructor: 'Master Tutor Shakir',
      isLiveNow: false,
      notes: newLiveNotes.trim(),
    });

    setNewLiveTitle('');
    setNewLiveNotes('');
    setShowAddLiveModal(false);
  };

  // Generate Quiz with Gemini
  const handleGenerateAIQuiz = async () => {
    if (!newQuizTopic.trim()) return;
    setAiQuizLoading(true);
    setAiQuizError('');

    try {
      const res = await fetch('/api/gemini/quiz-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newQuizSubject,
          topic: newQuizTopic.trim(),
          questionCount: 4,
          difficulty: 'Intermediate',
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        addQuiz({
          title: `${newQuizSubject} AI Quiz: ${newQuizTopic}`,
          subject: newQuizSubject,
          topic: newQuizTopic,
          timeLimitMinutes: Number(newQuizMinutes) || 15,
          questions: data.questions,
        });
        setShowAddQuizModal(false);
        setNewQuizTopic('');
      } else {
        setAiQuizError('Failed to parse AI quiz questions. Please try again.');
      }
    } catch {
      setAiQuizError('Error connecting to AI quiz generator service.');
    } finally {
      setAiQuizLoading(false);
    }
  };

  // AI Assisted Feedback for Student Submission
  const handleAIAssignmentFeedback = async (submission: any) => {
    const parentAsg = assignments.find((a) => a.id === submission.assignmentId);
    setAiGradingLoading(true);

    try {
      const res = await fetch('/api/gemini/assignment-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: parentAsg?.title || 'Coursework',
          studentSubmission: submission.workContent,
          rubric: `Subject: ${parentAsg?.subject}. Maximum marks: ${parentAsg?.totalMarks}`,
        }),
      });

      const data = await res.json();
      if (data.feedback) {
        setGradingFeedback(data.feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGradingLoading(false);
    }
  };

  // AI Student Progress Report Generator
  const handleGenerateStudentReport = async (student: Student) => {
    setSelectedStudentForAI(student);
    setAiSummaryLoading(true);
    setAiSummaryText(null);

    const att = calculateAttendanceRate(attendance, student.id);
    const completedMat = materials.length; // baseline
    const totalMat = materials.length;
    const studentSubs = submissions.filter((s) => s.studentId === student.id);

    try {
      const res = await fetch('/api/gemini/student-progress-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          attendanceRate: att.rate,
          completedTasks: studentSubs.length,
          totalTasks: assignments.length,
          quizAverage: 88,
          subject: student.subjects.join(', '),
        }),
      });

      const data = await res.json();
      setAiSummaryText(data.summary || 'Summary unavailable.');
    } catch {
      setAiSummaryText('Failed to generate summary with AI service.');
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // One-click Attendance marking for batch
  const handleMarkAllPresent = () => {
    const studentsToMark =
      attendanceBatch === 'All'
        ? students
        : students.filter((s) => s.batch === attendanceBatch);

    const records = studentsToMark.map((s) => ({
      date: attendanceDate,
      studentId: s.id,
      studentName: s.name,
      batch: s.batch,
      status: 'present' as const,
    }));

    markAttendanceBatch(records);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Tuition Principal & Administration Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Master Tutor Shakir's Academy Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Complete administrative authority: manage enrolled students, upload videos & study materials, grade assignments, track attendance, and broadcast live tuition notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>

            <button
              onClick={() => setShowAddLiveModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-slate-700 flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Broadcast Live Class</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-900/30">
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Total Students</div>
            <div className="text-2xl font-black text-white mt-1">{totalStudents}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Average Attendance</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{avgAttendance}%</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Submissions to Grade</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingSubmissions}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400 font-medium">Unresolved Doubts</div>
            <div className="text-2xl font-black text-indigo-400 mt-1">{pendingDoubts}</div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'students', label: 'Students & Progress Tracker', icon: Users, badge: students.length },
          { id: 'attendance', label: 'Attendance Dashboard', icon: CalendarCheck },
          { id: 'materials', label: 'Materials & Videos', icon: Video, badge: materials.length },
          { id: 'assignments', label: 'Assignments & Grading', icon: FileText, badge: submissions.length },
          { id: 'quizzes', label: 'Quizzes & AI Generator', icon: Award, badge: quizzes.length },
          { id: 'live', label: 'Live Notifications', icon: Radio, badge: liveClasses.length },
          { id: 'doubts', label: 'Student Doubts & Comments', icon: MessageSquare, badge: doubts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ADMIN TAB 1: STUDENTS & PROGRESS TRACKER */}
      {adminTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Student Enrollment & Working Progress</h2>
              <p className="text-xs text-slate-400">
                Track each student's attendance consistency, coursework completion, and generate AI performance reviews.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search students..."
                  className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Batches</option>
                <option value="Morning Elite Batch">Morning Elite</option>
                <option value="Evening Foundation Batch">Evening Foundation</option>
                <option value="Weekend Booster Batch">Weekend Booster</option>
              </select>
            </div>
          </div>

          {/* Students Matrix Table */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Grade & Batch</th>
                    <th className="py-3 px-4">Subjects</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-center">Submissions</th>
                    <th className="py-3 px-4 text-right">Actions & AI Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredStudents.map((student) => {
                    const att = calculateAttendanceRate(attendance, student.id);
                    const studentSubs = submissions.filter((s) => s.studentId === student.id);

                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{student.name}</div>
                          <div className="text-[11px] text-slate-400">{student.email}</div>
                          <div className="text-[10px] text-slate-500">Phone: {student.phone}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-200">{student.grade}</span>
                          <div className="text-[11px] text-indigo-400">{student.batch}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {student.subjects.map((sub) => (
                              <span
                                key={sub}
                                className="bg-slate-700/60 text-slate-300 text-[10px] px-1.5 py-0.5 rounded"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block font-extrabold px-2.5 py-1 rounded-full text-xs ${
                              att.rate >= 80
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {att.rate}% ({att.present}P / {att.absent}A)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-slate-200">
                            {studentSubs.length} / {assignments.length}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleGenerateStudentReport(student)}
                            className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border border-indigo-500/30 inline-flex items-center gap-1"
                            title="Generate AI progress assessment"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>AI Report</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${student.name} from tuition roster?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg transition"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Progress Report Modal / Card */}
          {selectedStudentForAI && (
            <div className="bg-slate-800/90 border border-indigo-900/50 rounded-2xl p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedStudentForAI(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    AI Academic Progress Review: {selectedStudentForAI.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automated tutor assessment powered by Gemini 3.8 Flash
                  </p>
                </div>
              </div>

              {aiSummaryLoading ? (
                <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
                  Analyzing attendance, coursework submissions, and quiz mastery...
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiSummaryText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ADMIN TAB 2: ATTENDANCE DASHBOARD */}
      {adminTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Attendance Tracking & Punctuality Dashboard</h2>
              <p className="text-xs text-slate-400">
                Log daily student attendance for tuition sessions (Present, Absent, Late, or Excused).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-300">Date:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={attendanceBatch}
                onChange={(e) => setAttendanceBatch(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Batches</option>
                <option value="Morning Elite Batch">Morning Elite Batch</option>
                <option value="Evening Foundation Batch">Evening Foundation Batch</option>
                <option value="Weekend Booster Batch">Weekend Booster Batch</option>
              </select>

              <button
                onClick={handleMarkAllPresent}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark All Present</span>
              </button>
            </div>
          </div>

          {/* Student Daily Marking Grid */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Marking Roll Call for: {attendanceDate}</span>
            </h3>

            <div className="space-y-3">
              {students
                .filter((s) => attendanceBatch === 'All' || s.batch === attendanceBatch)
                .map((student) => {
                  const record = attendance.find(
                    (a) => a.date === attendanceDate && a.studentId === student.id
                  );
                  const currentStatus = record?.status;

                  return (
                    <div
                      key={student.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-bold text-white text-sm">{student.name}</span>
                        <div className="text-[11px] text-slate-400">
                          {student.grade} • {student.batch}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {(['present', 'absent', 'late', 'excused'] as const).map((st) => {
                          const isActive = currentStatus === st;
                          const styles = {
                            present: isActive
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20',
                            absent: isActive
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-rose-500/20',
                            late: isActive
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-amber-400 hover:bg-amber-950/40 border border-amber-500/20',
                            excused: isActive
                              ? 'bg-indigo-500 text-white font-bold'
                              : 'bg-slate-800 text-indigo-400 hover:bg-indigo-950/40 border border-indigo-500/20',
                          }[st];

                          return (
                            <button
                              key={st}
                              onClick={() => updateAttendanceSingle(attendanceDate, student.id, st)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${styles}`}
                            >
                              {st}
                            </button>
                          );
                        })}

                        <input
                          type="text"
                          defaultValue={record?.note || ''}
                          onBlur={(e) => {
                            if (currentStatus) {
                              updateAttendanceSingle(attendanceDate, student.id, currentStatus, e.target.value);
                            }
                          }}
                          placeholder="Note (optional)"
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none w-36"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 3: MATERIALS & VIDEOS */}
      {adminTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Tuition Materials, Video Lessons & Notes</h2>
              <p className="text-xs text-slate-400">
                Upload new video lectures, problem sheets, formulas, and syllabus modules.
              </p>
            </div>

            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Material / Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-3 relative"
              >
                <button
                  onClick={() => deleteMaterial(mat.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1"
                  title="Delete Material"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-2 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                      {mat.subject} • {mat.topic}
                    </span>
                    <span className="text-xs text-slate-400">{mat.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{mat.title}</h3>
                  <p className="text-xs text-slate-400">{mat.content}</p>

                  {mat.videoUrl && (
                    <div className="text-xs text-indigo-400 font-mono truncate">
                      Video Link: {mat.videoUrl}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Uploaded: {mat.uploadedAt}</span>
                  <span>Duration: {mat.duration || mat.fileSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 4: ASSIGNMENTS & GRADING */}
      {adminTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Assignments Management & Grading Desk</h2>
              <p className="text-xs text-slate-400">
                Create new student homework tasks and review/grade submitted answers with teacher comments.
              </p>
            </div>

            <button
              onClick={() => setShowAddAsgModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          </div>

          {/* Submissions Inbox */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Student Coursework Submissions Inbox</span>
            </h3>

            <div className="space-y-4">
              {submissions.map((sub) => {
                const parentAsg = assignments.find((a) => a.id === sub.assignmentId);
                const isGrading = gradingSubId === sub.id;

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{sub.studentName}</span>
                          <span className="text-xs text-slate-400">for {parentAsg?.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Submitted on {new Date(sub.submittedAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status === 'graded' ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            Graded: {sub.grade} / {parentAsg?.totalMarks || 50}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            Needs Grading
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setGradingSubId(sub.id);
                            setGradingScore(sub.grade || 45);
                            setGradingFeedback(sub.teacherFeedback || '');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          {sub.status === 'graded' ? 'Edit Grade' : 'Grade Now'}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 text-xs text-slate-300">
                      <span className="text-slate-500 font-semibold">Student Answer: </span>
                      {sub.workContent}
                    </div>

                    {isGrading && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            Teacher Evaluation & Comments
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAIAssignmentFeedback(sub)}
                            disabled={aiGradingLoading}
                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{aiGradingLoading ? 'Generating AI Feedback...' : 'Suggest Feedback with Gemini'}</span>
                          </button>
                        </div>

                        <div className="flex gap-4 items-center">
                          <label className="text-xs font-semibold text-slate-300">
                            Award Marks (out of {parentAsg?.totalMarks || 50}):
                          </label>
                          <input
                            type="number"
                            value={gradingScore}
                            onChange={(e) => setGradingScore(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white w-24"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Teacher Feedback & Guidance for Student:
                          </label>
                          <textarea
                            rows={3}
                            value={gradingFeedback}
                            onChange={(e) => setGradingFeedback(e.target.value)}
                            placeholder="Add specific compliments, corrections, or formulas to review..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              gradeSubmission(sub.id, gradingScore, gradingFeedback);
                              setGradingSubId(null);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                          >
                            Save Grade & Comment
                          </button>
                          <button
                            onClick={() => setGradingSubId(null)}
                            className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 5: QUIZZES & AI GENERATOR */}
      {adminTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Quiz Center & AI Quiz Maker</h2>
              <p className="text-xs text-slate-400">
                Design tests manually or use Gemini 3.8 Flash to generate instant academic questions with explanations.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuizModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create / AI Generate Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-3 relative"
              >
                <button
                  onClick={() => deleteQuiz(quiz.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-2 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                    {quiz.subject} • {quiz.topic}
                  </span>
                  <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                  <p className="text-xs text-slate-400">
                    {quiz.questions.length} Questions • Time: {quiz.timeLimitMinutes} mins
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-400">
                  Created: {quiz.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 6: LIVE NOTIFICATIONS */}
      {adminTab === 'live' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Live Class Notifications & Broadcasts</h2>
              <p className="text-xs text-slate-400">
                Schedule online classes, push live meeting links to student dashboards, and keep everyone updated.
              </p>
            </div>

            <button
              onClick={() => setShowAddLiveModal(true)}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-rose-500/20"
            >
              <Radio className="w-4 h-4" />
              <span>Schedule Live Class</span>
            </button>
          </div>

          <div className="space-y-4">
            {liveClasses.map((live) => (
              <div
                key={live.id}
                className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        live.isLiveNow
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}
                    >
                      {live.isLiveNow ? '🔴 Broadcasting Now' : 'Scheduled'}
                    </span>
                    <span className="text-xs text-slate-400">• {live.subject} ({live.batch})</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{live.title}</h3>
                  <p className="text-xs text-slate-400">{live.notes}</p>
                  <div className="text-xs text-indigo-300 font-mono">
                    Join Link: <a href={live.joinUrl} target="_blank" rel="noreferrer" className="underline">{live.joinUrl}</a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleLiveNow(live.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      live.isLiveNow
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {live.isLiveNow ? 'End Live Session' : 'Go Live Now'}
                  </button>

                  <button
                    onClick={() => deleteLiveClass(live.id)}
                    className="text-slate-400 hover:text-rose-400 p-2 rounded-lg"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN TAB 7: DOUBTS & COMMENTS */}
      {adminTab === 'doubts' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Student Questions, Doubts & Comments</h2>
            <p className="text-xs text-slate-400">
              Provide personalized responses and mentorship comments to students.
            </p>
          </div>

          <div className="space-y-4">
            {doubts.map((dbt) => {
              const isReplying = activeReplyingDoubtId === dbt.id;

              return (
                <div
                  key={dbt.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{dbt.studentName}</span>
                      <span className="text-xs text-slate-400 ml-2">({dbt.subject})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dbt.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {dbt.status === 'resolved' ? 'Answered' : 'Awaiting Reply'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{dbt.question}"
                  </p>

                  {dbt.teacherReply && (
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-xs">
                      <span className="text-indigo-400 font-bold">Your Response: </span>
                      <span className="text-slate-200">{dbt.teacherReply}</span>
                    </div>
                  )}

                  {isReplying ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={3}
                        value={doubtReplyText}
                        onChange={(e) => setDoubtReplyText(e.target.value)}
                        placeholder="Write your detailed explanation and guidance..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (doubtReplyText.trim()) {
                              replyToDoubt(dbt.id, doubtReplyText.trim());
                              setActiveReplyingDoubtId(null);
                              setDoubtReplyText('');
                            }
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => setActiveReplyingDoubtId(null)}
                          className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyingDoubtId(dbt.id);
                        setDoubtReplyText(dbt.teacherReply || '');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                      {dbt.teacherReply ? 'Edit Response' : 'Reply to Student'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Admit New Student to Tuition</h3>
            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={newStudentParentPhone}
                    onChange={(e) => setNewStudentParentPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grade</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Batch</label>
                  <select
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Morning Elite Batch">Morning Elite Batch</option>
                    <option value="Evening Foundation Batch">Evening Foundation Batch</option>
                    <option value="Weekend Booster Batch">Weekend Booster Batch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tutor Initial Notes</label>
                <textarea
                  rows={2}
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  placeholder="Academic strengths, target goals, focus areas..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  Admit Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MATERIAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Add Study Material / Video Lecture</h3>
            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics & Heat Engine Numericals"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newMatSubject}
                    onChange={(e) => setNewMatSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newMatTopic}
                    onChange={(e) => setNewMatTopic(e.target.value)}
                    placeholder="e.g. Heat Engines"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Material Type</label>
                  <select
                    value={newMatType}
                    onChange={(e) => setNewMatType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="video">Video Lecture (Embed / URL)</option>
                    <option value="pdf">PDF Worksheet / Notes</option>
                    <option value="notes">Text Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration / Size</label>
                  <input
                    type="text"
                    value={newMatDuration}
                    onChange={(e) => setNewMatDuration(e.target.value)}
                    placeholder="e.g. 35 mins or 3.2 MB"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Video URL (YouTube or MP4 embed)
                </label>
                <input
                  type="text"
                  value={newMatVideoUrl}
                  onChange={(e) => setNewMatVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lesson Content / Notes</label>
                <textarea
                  rows={3}
                  value={newMatContent}
                  onChange={(e) => setNewMatContent(e.target.value)}
                  placeholder="Outline key concepts, exam tips, and problem numbers covered in this lesson..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  Publish Material
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ASSIGNMENT */}
      {showAddAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Create New Student Assignment</h3>
            <form onSubmit={handleAddAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  placeholder="e.g. Integral Calculus Past Paper Practice Set"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newAsgSubject}
                    onChange={(e) => setNewAsgSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newAsgTotalMarks}
                    onChange={(e) => setNewAsgTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newAsgDueDate}
                  onChange={(e) => setNewAsgDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Tasks</label>
                <textarea
                  rows={4}
                  value={newAsgDescription}
                  onChange={(e) => setNewAsgDescription(e.target.value)}
                  placeholder="List specific problems, rubric criteria, or instructions for students to complete..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  Publish Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAsgModal(false)}
                  className="px-4 bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD QUIZ (AI OR MANUAL) */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-2">Create / Generate Quiz</h3>
            <p className="text-xs text-slate-400 mb-4">
              Use Gemini 3.8 Flash to instantly generate structured multiple-choice questions with full explanations.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newQuizSubject}
                    onChange={(e) => setNewQuizSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Limit (mins)</label>
                  <input
                    type="number"
                    value={newQuizMinutes}
                    onChange={(e) => setNewQuizMinutes(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic / Exam Area *
                </label>
                <input
                  type="text"
                  required
                  value={newQuizTopic}
                  onChange={(e) => setNewQuizTopic(e.target.value)}
                  placeholder="e.g. Electromagnetic Induction, Organic Alcohols, Quadratic Equation Roots"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {aiQuizError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {aiQuizError}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={aiQuizLoading || !newQuizTopic.trim()}
                  onClick={handleGenerateAIQuiz}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiQuizLoading ? 'AI Generating Quiz...' : 'Generate AI Quiz with Gemini'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="px-4 bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST LIVE CLASS */}
      {showAddLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Broadcast Live Class Notification</h3>
            <form onSubmit={handleAddLiveClassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Class Topic / Title *</label>
                <input
                  type="text"
                  required
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  placeholder="e.g. Live Masterclass: Physics Numerical Solving & Past Papers"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newLiveSubject}
                    onChange={(e) => setNewLiveSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Batch</label>
                  <select
                    value={newLiveBatch}
                    onChange={(e) => setNewLiveBatch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Morning Elite Batch">Morning Elite Batch</option>
                    <option value="Evening Foundation Batch">Evening Foundation Batch</option>
                    <option value="Weekend Booster Batch">Weekend Booster Batch</option>
                    <option value="All Batches">All Batches</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newLiveStartTime}
                    onChange={(e) => setNewLiveStartTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newLiveDuration}
                    onChange={(e) => setNewLiveDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Meet / Zoom Meeting Link *
                </label>
                <input
                  type="text"
                  required
                  value={newLiveUrl}
                  onChange={(e) => setNewLiveUrl(e.target.value)}
                  placeholder="https://meet.google.com/xyz-tuition-room"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Instructions for Students
                </label>
                <textarea
                  rows={2}
                  value={newLiveNotes}
                  onChange={(e) => setNewLiveNotes(e.target.value)}
                  placeholder="e.g. Keep textbook Chapter 5 open, bring scientific calculator..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Broadcast to Students
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLiveModal(false)}
                  className="px-4 bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
