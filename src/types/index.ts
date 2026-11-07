export type UserRole = 'student' | 'admin';

export interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  parentPhone?: string;
  batch: string;
  subjects: string[];
  enrolledAt: string;
  avatarUrl?: string;
  notes?: string;
}

export interface Material {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: 'video' | 'pdf' | 'notes' | 'worksheet';
  videoUrl?: string;
  fileUrl?: string;
  content?: string;
  uploadedAt: string;
  duration?: string; // e.g. "28 mins"
  fileSize?: string;
  authorName: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  attachmentUrl?: string;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  workContent: string;
  fileAttachment?: string;
  status: 'submitted' | 'graded' | 'needs_revision';
  grade?: number;
  teacherFeedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  dueDate?: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  answers: Record<string, number>;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  batch: string;
  status: AttendanceStatus;
  note?: string;
}

export interface LiveClassNotification {
  id: string;
  title: string;
  subject: string;
  batch: string;
  startTime: string; // ISO string
  durationMinutes: number;
  joinUrl: string;
  instructor: string;
  isLiveNow: boolean;
  notes?: string;
  createdAt: string;
}

export interface StudentDoubt {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  question: string;
  createdAt: string;
  status: 'pending' | 'resolved';
  teacherReply?: string;
  repliedAt?: string;
  aiHint?: string;
}

export interface StudentCourseProgress {
  studentId: string;
  completedMaterialIds: string[];
  completedAssignmentIds: string[];
  quizScores: Record<string, number>; // quizId -> score percentage
}
