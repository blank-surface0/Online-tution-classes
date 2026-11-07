import { AttendanceRecord, AttendanceStatus, QuizQuestion } from '../types';

export const ADMIN_PASS = 'shakir7930';

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password.trim() === ADMIN_PASS;
}

export function calculateAttendanceRate(
  records: AttendanceRecord[],
  studentId: string
): {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
} {
  const studentRecords = records.filter((r) => r.studentId === studentId);
  const total = studentRecords.length;

  if (total === 0) {
    return { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 100 };
  }

  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  for (const r of studentRecords) {
    if (r.status === 'present') present++;
    else if (r.status === 'absent') absent++;
    else if (r.status === 'late') late++;
    else if (r.status === 'excused') excused++;
  }

  // Late counts as 0.75 attendance, excused not counted against student
  const effectiveTotal = Math.max(1, total - excused);
  const attendanceScore = present + late * 0.75;
  const rate = Math.min(100, Math.round((attendanceScore / effectiveTotal) * 100));

  return { total, present, absent, late, excused, rate };
}

export function calculateStudentProgress(
  completedMaterialIds: string[] | number,
  totalMaterialsCount: number,
  completedAssignmentIds: string[] | number,
  totalAssignmentsCount: number,
  completedQuizzes: string[] | number,
  totalQuizzesCount: number
): {
  materialsPct: number;
  assignmentsPct: number;
  quizzesPct: number;
  overallPct: number;
} {
  const mCount = Array.isArray(completedMaterialIds) ? completedMaterialIds.length : (completedMaterialIds || 0);
  const aCount = Array.isArray(completedAssignmentIds) ? completedAssignmentIds.length : (completedAssignmentIds || 0);
  const qCount = Array.isArray(completedQuizzes) ? completedQuizzes.length : (completedQuizzes || 0);

  const mPct =
    totalMaterialsCount > 0
      ? Math.min(100, Math.round((mCount / totalMaterialsCount) * 100))
      : 100;

  const aPct =
    totalAssignmentsCount > 0
      ? Math.min(100, Math.round((aCount / totalAssignmentsCount) * 100))
      : 100;

  const qPct =
    totalQuizzesCount > 0
      ? Math.min(100, Math.round((qCount / totalQuizzesCount) * 100))
      : 100;

  // Weighted average: Materials 30%, Assignments 40%, Quizzes 30%
  const overall = Math.round(mPct * 0.3 + aPct * 0.4 + qPct * 0.3);

  return {
    materialsPct: mPct,
    assignmentsPct: aPct,
    quizzesPct: qPct,
    overallPct: Math.min(100, Math.max(0, overall)),
  };
}

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>
): {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
} {
  if (!questions || questions.length === 0) {
    return { score: 0, maxScore: 0, percentage: 0, passed: false };
  }

  let score = 0;
  for (const q of questions) {
    if (answers[q.id] !== undefined && answers[q.id] === q.correctIndex) {
      score += 1;
    }
  }

  const maxScore = questions.length;
  const percentage = Math.round((score / maxScore) * 100);
  const passed = percentage >= 60;

  return { score, maxScore, percentage, passed };
}

export function getLiveClassStatus(
  startTimeIso: string,
  durationMinutes: number = 60,
  referenceDate: Date = new Date()
): 'live' | 'upcoming' | 'ended' {
  const start = new Date(startTimeIso).getTime();
  const end = start + durationMinutes * 60 * 1000;
  const now = referenceDate.getTime();

  if (now >= start && now <= end) {
    return 'live';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'ended';
  }
}
