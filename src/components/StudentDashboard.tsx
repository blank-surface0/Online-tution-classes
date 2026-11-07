import React, { useState } from 'react';
import { useTuition } from '../context/TuitionContext';
import {
  calculateAttendanceRate,
  calculateStudentProgress,
  gradeQuiz,
} from '../utils/academicLogic';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Radio,
  Video,
  FileText,
  HelpCircle,
  Award,
  CalendarCheck,
  AlertCircle,
  ExternalLink,
  Send,
  Play,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Download,
  BookCheck,
  Check,
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    materials,
    assignments,
    submissions,
    quizzes,
    quizAttempts,
    attendance,
    liveClasses,
    doubts,
    completedMaterialIds,
    toggleMaterialCompleted,
    submitAssignmentWork,
    submitQuiz,
    addDoubt,
  } = useTuition();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'materials' | 'assignments' | 'quizzes' | 'attendance' | 'doubts'
  >('overview');

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  // Assignment submission modal state
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionAttachment, setSubmissionAttachment] = useState('');

  // Quiz active state
  const [activeTakingQuiz, setActiveTakingQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
  } | null>(null);

  // Ask doubt state
  const [doubtSubject, setDoubtSubject] = useState('Mathematics');
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  if (!currentStudent) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Student Profile Selected</h2>
        <p className="text-sm text-slate-400">Please sign up or select a student profile to view the dashboard.</p>
      </div>
    );
  }

  // Calculate statistics
  const attendanceStats = calculateAttendanceRate(attendance, currentStudent.id);
  const studentSubmissions = submissions.filter((s) => s.studentId === currentStudent.id);
  const studentAttempts = quizAttempts.filter((q) => q.studentId === currentStudent.id);
  
  const studentQuizScores = studentAttempts.map((a) => a.percentage);
  const quizAverage =
    studentQuizScores.length > 0
      ? Math.round(studentQuizScores.reduce((a, b) => a + b, 0) / studentQuizScores.length)
      : 85; // default benchmark

  const progressStats = calculateStudentProgress(
    completedMaterialIds,
    materials.length,
    studentSubmissions.map((s) => s.assignmentId),
    assignments.length,
    studentAttempts.length,
    quizzes.length
  );

  // Filtered materials
  const filteredMaterials =
    selectedSubject === 'All'
      ? materials
      : materials.filter((m) => m.subject.toLowerCase() === selectedSubject.toLowerCase());

  // Handle Quiz flow
  const startQuiz = (quiz: Quiz) => {
    setActiveTakingQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const finishQuiz = () => {
    if (!activeTakingQuiz) return;
    const result = gradeQuiz(activeTakingQuiz.questions, userAnswers);
    setQuizResult(result);
    submitQuiz(
      activeTakingQuiz.id,
      userAnswers,
      result.score,
      result.maxScore,
      result.percentage
    );
  };

  // Handle assignment submission
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId || !submissionText.trim()) return;
    submitAssignmentWork(submittingAssignmentId, submissionText.trim(), submissionAttachment.trim() || undefined);
    setSubmittingAssignmentId(null);
    setSubmissionText('');
    setSubmissionAttachment('');
  };

  // Handle Doubt submission with optional AI instant helper
  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;
    addDoubt(doubtSubject, doubtQuestion.trim());
    setDoubtQuestion('');
  };

  const handleAskAIHelper = async () => {
    if (!doubtQuestion.trim()) return;
    setAiAssistantLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: doubtQuestion.trim(),
          subject: doubtSubject,
          studentGrade: currentStudent.grade,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setAiResponse(data.answer);
      } else {
        setAiResponse('Unable to fetch AI explanation right now.');
      }
    } catch {
      setAiResponse('Error contacting tutor service. Please check server logs.');
    } finally {
      setAiAssistantLoading(false);
    }
  };

  const activeLiveClass = liveClasses.find((l) => l.isLiveNow) || liveClasses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome & Working Progress View */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <BookCheck className="w-3.5 h-3.5" />
              <span>Student Academic Hub • {currentStudent.grade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentStudent.name}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Track your coursework completion, watch tuition lessons, complete assignments, and prepare for upcoming tests with Master Tutor Shakir.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-medium">
                Batch: {currentStudent.batch}
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 font-medium">
                Subjects: {currentStudent.subjects.join(', ')}
              </span>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-slate-800/80 border border-slate-700/70 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-lg min-w-[320px]">
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center relative">
                <span className="text-2xl font-black text-white">{progressStats.overallPct}%</span>
                <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                  Coursework
                </span>
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * progressStats.overallPct) / 100}
                    className="text-indigo-500 transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attendance Rate:</span>
                <span className={`font-bold ${attendanceStats.rate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {attendanceStats.rate}% ({attendanceStats.present} Present)
                </span>
              </div>
              <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${attendanceStats.rate}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Materials Completed:</span>
                <span className="font-semibold text-slate-200">
                  {completedMaterialIds.length} / {materials.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assignments Done:</span>
                <span className="font-semibold text-slate-200">
                  {studentSubmissions.length} / {assignments.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Class Highlight Banner */}
        {activeLiveClass && (
          <div className="mt-6 pt-6 border-t border-indigo-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    {activeLiveClass.isLiveNow ? '🔴 Live Class Active' : 'Upcoming Live Class'}
                  </span>
                  <span className="text-xs text-slate-400">• {activeLiveClass.subject}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{activeLiveClass.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{activeLiveClass.notes}</p>
              </div>
            </div>
            <a
              href={activeLiveClass.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <span>Join Live Classroom</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Progress', icon: TrendingUp },
          { id: 'materials', label: 'Study Materials & Videos', icon: Video, badge: materials.length },
          { id: 'assignments', label: 'Assignments', icon: FileText, badge: assignments.length },
          { id: 'quizzes', label: 'Quizzes', icon: Award, badge: quizzes.length },
          { id: 'attendance', label: 'Attendance Tracker', icon: CalendarCheck, badge: `${attendanceStats.rate}%` },
          { id: 'doubts', label: 'Ask Tutor & AI Help', icon: HelpCircle, badge: doubts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & WORKING PROGRESS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{completedMaterialIds.length} / {materials.length}</div>
                <div className="text-xs text-slate-400">Materials Completed</div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{attendanceStats.rate}%</div>
                <div className="text-xs text-slate-400">Attendance Reliability</div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{studentAttempts.length > 0 ? `${quizAverage}%` : '85%'}</div>
                <div className="text-xs text-slate-400">Quiz Average Score</div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{studentSubmissions.length} Submitted</div>
                <div className="text-xs text-slate-400">{assignments.length - studentSubmissions.length} Assignments Due</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Assignments & Next Deadlines */}
            <div className="lg:col-span-2 bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Assignments & Coursework Tasks</span>
                </h3>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {assignments.map((asg) => {
                  const submission = studentSubmissions.find((s) => s.assignmentId === asg.id);
                  const isSubmitted = !!submission;
                  return (
                    <div
                      key={asg.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                            {asg.subject}
                          </span>
                          <span className="text-xs text-slate-400">Due: {asg.dueDate}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-200">{asg.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{asg.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSubmitted ? (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {submission.grade !== undefined ? `${submission.grade} / ${asg.totalMarks} Marks` : 'Submitted'}
                            </span>
                            {submission.teacherFeedback && (
                              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] truncate">
                                "{submission.teacherFeedback}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSubmittingAssignmentId(asg.id);
                              setActiveTab('assignments');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            Submit Work
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tutor Feedback & Mentorship Card */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Master Tutor Shakir's Feedback</span>
              </h3>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 font-bold text-xs text-white flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Master Tutor Shakir</div>
                    <div className="text-[10px] text-indigo-300">Head of Academic Excellence</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{currentStudent.notes || 'Consistently attentive during live classes. Keep focusing on practice problem sets for higher examination scores!'}"
                </p>
                <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Enrolled: {currentStudent.enrolledAt}</span>
                  <span className="text-emerald-400 font-medium">Active Scholar</span>
                </div>
              </div>

              {/* Attendance Quick Snapshot */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Recent Attendance Sessions</span>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-indigo-400 hover:underline text-[11px]"
                  >
                    View All
                  </button>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {attendance
                    .filter((a) => a.studentId === currentStudent.id)
                    .slice(0, 7)
                    .map((rec) => {
                      const color =
                        rec.status === 'present'
                          ? 'bg-emerald-500'
                          : rec.status === 'late'
                          ? 'bg-amber-500'
                          : 'bg-rose-500';
                      return (
                        <div
                          key={rec.id}
                          className={`flex-1 h-6 rounded-md ${color} flex items-center justify-center text-[10px] font-bold text-slate-950 uppercase`}
                          title={`${rec.date}: ${rec.status}`}
                        >
                          {rec.status.charAt(0)}
                        </div>
                      );
                    })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>P = Present</span>
                  <span>L = Late</span>
                  <span>A = Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDY MATERIALS & VIDEO LESSONS */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Study Materials & Video Lectures</h2>
              <p className="text-xs text-slate-400">
                Watch curated masterclasses, download revision PDFs, and track completion to boost your score.
              </p>
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {['All', 'Mathematics', 'Physics', 'Chemistry'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSubject === sub
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => {
              const isCompleted = completedMaterialIds.includes(mat.id);
              return (
                <div
                  key={mat.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {mat.subject} • {mat.topic}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mat.duration || mat.fileSize || 'Lesson'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{mat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mat.content}</p>

                    {/* Video Player Embed preview if video */}
                    {mat.type === 'video' && mat.videoUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60">
                        <iframe
                          src={mat.videoUrl}
                          title={mat.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => toggleMaterialCompleted(mat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <BookCheck className="w-3.5 h-3.5" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>

                    <div className="text-[11px] text-slate-400">
                      Uploaded by {mat.authorName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Assignments & Homework</h2>
            <p className="text-xs text-slate-400">
              Submit your homework solutions for grading and constructive feedback from Master Tutor Shakir.
            </p>
          </div>

          <div className="space-y-4">
            {assignments.map((asg) => {
              const submission = studentSubmissions.find((s) => s.assignmentId === asg.id);
              const isSubmittingThis = submittingAssignmentId === asg.id;

              return (
                <div
                  key={asg.id}
                  className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                          {asg.subject}
                        </span>
                        <span className="text-xs text-rose-400 font-medium">Due Date: {asg.dueDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{asg.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-300 bg-slate-700/60 px-3 py-1 rounded-xl">
                        Max Marks: {asg.totalMarks}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    {asg.description}
                  </p>

                  {/* Submission Status or Form */}
                  {submission ? (
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Work Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                        {submission.grade !== undefined && (
                          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            Grade: {submission.grade} / {asg.totalMarks}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">Your Response: </span>
                        {submission.workContent}
                      </div>
                      {submission.teacherFeedback && (
                        <div className="mt-3 p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-xs">
                          <div className="font-bold text-indigo-300 mb-1">Teacher Feedback:</div>
                          <div className="text-slate-200">{submission.teacherFeedback}</div>
                        </div>
                      )}
                    </div>
                  ) : isSubmittingThis ? (
                    <form onSubmit={handleAssignmentSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Your Solution / Working / Essay *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type or paste your detailed answers and step-by-step calculations here..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Optional File Link / Drive URL (PDF, Photo, Google Doc)
                        </label>
                        <input
                          type="text"
                          value={submissionAttachment}
                          onChange={(e) => setSubmissionAttachment(e.target.value)}
                          placeholder="e.g. https://drive.google.com/file/d/your-solution.pdf"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Submit Assignment Now
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmittingAssignmentId(null)}
                          className="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSubmittingAssignmentId(asg.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Your Work</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Interactive Quizzes & Self-Assessment</h2>
            <p className="text-xs text-slate-400">
              Test your mastery on key topics with instant automated grading and explanations.
            </p>
          </div>

          {activeTakingQuiz ? (
            /* Active Quiz Interface */
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {activeTakingQuiz.subject} • {activeTakingQuiz.topic}
                  </span>
                  <h3 className="text-base font-bold text-white">{activeTakingQuiz.title}</h3>
                </div>
                <button
                  onClick={() => setActiveTakingQuiz(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Exit Quiz
                </button>
              </div>

              {quizResult ? (
                /* Quiz Results Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border-2 border-indigo-500">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                  <div className="text-4xl font-black text-white">
                    {quizResult.score} / {quizResult.maxScore}
                  </div>
                  <p className="text-xs text-indigo-300 font-semibold">
                    Score: {quizResult.percentage}% ({quizResult.percentage >= 60 ? 'Passed' : 'Needs Practice'})
                  </p>

                  <div className="space-y-3 text-left pt-4 max-h-72 overflow-y-auto">
                    {activeTakingQuiz.questions.map((q, idx) => {
                      const ans = userAnswers[q.id];
                      const isCorrect = ans === q.correctIndex;
                      return (
                        <div
                          key={q.id}
                          className={`p-3 rounded-xl border text-xs ${
                            isCorrect
                              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                              : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                          }`}
                        >
                          <div className="font-semibold">
                            Q{idx + 1}. {q.question}
                          </div>
                          <div className="mt-1 text-[11px]">
                            Your answer: {q.options[ans]} {isCorrect ? '✓' : `✗ (Correct: ${q.options[q.correctIndex]})`}
                          </div>
                          {q.explanation && (
                            <div className="mt-1 text-[10px] text-slate-400 italic">
                              Explanation: {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTakingQuiz(null)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl text-xs transition"
                  >
                    Back to All Quizzes
                  </button>
                </div>
              ) : (
                /* Ongoing Quiz Screen */
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Question {currentQuestionIndex + 1} of {activeTakingQuiz.questions.length}
                    </span>
                    <span>Single Choice</span>
                  </div>

                  {(() => {
                    const currentQ = activeTakingQuiz.questions[currentQuestionIndex];
                    return (
                      <div className="space-y-4">
                        <div className="text-sm font-semibold text-white">
                          {currentQ.question}
                        </div>

                        <div className="space-y-2">
                          {currentQ.options.map((opt, optIdx) => {
                            const isSelected = userAnswers[currentQ.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                                    : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                <span>{opt}</span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-indigo-400 bg-indigo-500'
                                      : 'border-slate-600'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 disabled:opacity-40 hover:text-white"
                    >
                      &larr; Previous
                    </button>

                    {currentQuestionIndex < activeTakingQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Next Question &rarr;
                      </button>
                    ) : (
                      <button
                        onClick={finishQuiz}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
                      >
                        Submit Final Answers
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => {
                const previousAttempt = quizAttempts.find(
                  (a) => a.quizId === quiz.id && a.studentId === currentStudent.id
                );

                return (
                  <div
                    key={quiz.id}
                    className="bg-slate-800/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                          {quiz.subject} • {quiz.topic}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.timeLimitMinutes} mins
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                      <p className="text-xs text-slate-400">
                        {quiz.questions.length} Questions covering key analytical concepts.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      {previousAttempt ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            Score: {previousAttempt.percentage}% ({previousAttempt.score}/{previousAttempt.maxScore})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Not attempted yet</span>
                      )}

                      <button
                        onClick={() => startQuiz(quiz)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition"
                      >
                        {previousAttempt ? 'Retake Quiz' : 'Start Quiz'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ATTENDANCE TRACKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Attendance Records & Punctuality</h2>
              <p className="text-xs text-slate-400">
                Official attendance records logged by Master Tutor Shakir for tuition classes.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-emerald-400">
                Overall Rate: {attendanceStats.rate}%
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-emerald-400">{attendanceStats.present}</div>
              <div className="text-[11px] text-slate-400">Present Sessions</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-rose-400">{attendanceStats.absent}</div>
              <div className="text-[11px] text-slate-400">Absent Sessions</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-amber-400">{attendanceStats.late}</div>
              <div className="text-[11px] text-slate-400">Late Arrivals</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-indigo-400">{attendanceStats.excused}</div>
              <div className="text-[11px] text-slate-400">Excused Leaves</div>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
              Session-by-Session Attendance Log
            </div>
            <div className="divide-y divide-slate-800/60">
              {attendance
                .filter((a) => a.studentId === currentStudent.id)
                .map((rec) => {
                  const statusBadge =
                    rec.status === 'present'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : rec.status === 'late'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : rec.status === 'excused'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                  return (
                    <div
                      key={rec.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{rec.date}</span>
                          <span className="text-[11px] text-slate-400">({rec.batch})</span>
                        </div>
                        {rec.note && <div className="text-xs text-slate-400 italic">{rec.note}</div>}
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusBadge}`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ASK TUTOR & AI STUDY BUDDY */}
      {activeTab === 'doubts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ask Doubt Form */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  <span>Ask a Question / Clear a Doubt</span>
                </h3>
              </div>

              <p className="text-xs text-slate-400">
                Stuck on a homework problem or exam topic? Post it directly to Master Tutor Shakir, or get instant AI explanation powered by Gemini 3.8 Flash!
              </p>

              <form onSubmit={handleDoubtSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={doubtSubject}
                    onChange={(e) => setDoubtSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Question / Concept Doubt *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={doubtQuestion}
                    onChange={(e) => setDoubtQuestion(e.target.value)}
                    placeholder="Describe what you don't understand, e.g. How do I solve integral of sin^3(x)dx? or Why does kinetic friction oppose relative velocity?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post to Tutor Shakir</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAskAIHelper}
                    disabled={aiAssistantLoading || !doubtQuestion.trim()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>{aiAssistantLoading ? 'AI Thinking...' : 'Get Instant AI Explanation'}</span>
                  </button>
                </div>
              </form>

              {/* Instant AI Explanation Display */}
              {aiResponse && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Study Buddy (Gemini 3.8 Flash):</span>
                  </div>
                  <div className="text-slate-200 whitespace-pre-line leading-relaxed">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>

            {/* Questions & Tutor Responses History */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Your Questions & Tutor Shakir's Responses</span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {doubts.map((dbt) => {
                  const isCurrent = dbt.studentId === currentStudent.id;
                  return (
                    <div
                      key={dbt.id}
                      className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                            {dbt.subject}
                          </span>
                          <span className="text-xs text-slate-400">
                            by {dbt.studentName} {isCurrent && '(You)'}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dbt.status === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {dbt.status === 'resolved' ? 'Teacher Replied' : 'Pending Response'}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200">{dbt.question}</div>

                      {dbt.teacherReply && (
                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 space-y-1">
                          <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            <span>Master Tutor Shakir Replied:</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {dbt.teacherReply}
                          </p>
                        </div>
                      )}

                      {dbt.aiHint && !dbt.teacherReply && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300">
                          <span className="text-amber-400 font-semibold">Tutor AI Hint: </span>
                          {dbt.aiHint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
