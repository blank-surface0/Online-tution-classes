import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Material,
  Assignment,
  Submission,
  Quiz,
  QuizAttempt,
  AttendanceRecord,
  LiveClassNotification,
  StudentDoubt,
  UserRole,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_ATTENDANCE,
  INITIAL_LIVE_CLASSES,
  INITIAL_DOUBTS,
} from '../data/mockData';
import { verifyAdminPassword } from '../utils/academicLogic';

interface TuitionContextType {
  role: 'student' | 'admin' | 'guest';
  currentStudent: Student | null;
  isAdminAuthenticated: boolean;
  students: Student[];
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  attendance: AttendanceRecord[];
  liveClasses: LiveClassNotification[];
  doubts: StudentDoubt[];
  completedMaterialIds: string[];

  // Auth & Roles
  signUpStudent: (studentData: Omit<Student, 'id' | 'enrolledAt'>) => Student;
  loginStudent: (studentId: string) => void;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
  setRole: (role: 'student' | 'admin' | 'guest') => void;

  // Admin Actions
  addStudent: (student: Omit<Student, 'id' | 'enrolledAt'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  addMaterial: (material: Omit<Material, 'id' | 'uploadedAt'>) => void;
  deleteMaterial: (id: string) => void;
  toggleMaterialCompleted: (materialId: string) => void;

  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignmentWork: (assignmentId: string, content: string, fileAttachment?: string) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;

  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  deleteQuiz: (id: string) => void;
  submitQuiz: (quizId: string, answers: Record<string, number>, score: number, maxScore: number, percentage: number) => void;

  markAttendanceBatch: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateAttendanceSingle: (date: string, studentId: string, status: AttendanceRecord['status'], note?: string) => void;

  addLiveClass: (liveClass: Omit<LiveClassNotification, 'id' | 'createdAt'>) => void;
  deleteLiveClass: (id: string) => void;
  toggleLiveNow: (id: string) => void;

  addDoubt: (subject: string, question: string) => void;
  replyToDoubt: (doubtId: string, reply: string) => void;
}

const TuitionContext = createContext<TuitionContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`apex_tuition_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`apex_tuition_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const TuitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() =>
    loadFromStorage('students', INITIAL_STUDENTS)
  );
  const [materials, setMaterials] = useState<Material[]>(() =>
    loadFromStorage('materials', INITIAL_MATERIALS)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    loadFromStorage('assignments', INITIAL_ASSIGNMENTS)
  );
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    loadFromStorage('submissions', INITIAL_SUBMISSIONS)
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>(() =>
    loadFromStorage('quizzes', INITIAL_QUIZZES)
  );
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() =>
    loadFromStorage('quiz_attempts', [])
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    loadFromStorage('attendance', INITIAL_ATTENDANCE)
  );
  const [liveClasses, setLiveClasses] = useState<LiveClassNotification[]>(() =>
    loadFromStorage('live_classes', INITIAL_LIVE_CLASSES)
  );
  const [doubts, setDoubts] = useState<StudentDoubt[]>(() =>
    loadFromStorage('doubts', INITIAL_DOUBTS)
  );

  // Completed materials by student (studentId -> array of materialIds)
  const [completedMap, setCompletedMap] = useState<Record<string, string[]>>(() =>
    loadFromStorage('completed_map', {
      'std-1': ['mat-1'],
      'std-2': ['mat-1', 'mat-2'],
    })
  );

  // Authentication & session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadFromStorage('is_admin_auth', false)
  );
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() =>
    loadFromStorage('current_student_id', null)
  );
  const [role, setRole] = useState<'student' | 'admin' | 'guest'>(() => {
    const savedRole = loadFromStorage<'student' | 'admin' | 'guest'>('role', 'guest');
    return savedRole;
  });

  // Sync to localStorage
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('materials', materials), [materials]);
  useEffect(() => saveToStorage('assignments', assignments), [assignments]);
  useEffect(() => saveToStorage('submissions', submissions), [submissions]);
  useEffect(() => saveToStorage('quizzes', quizzes), [quizzes]);
  useEffect(() => saveToStorage('quiz_attempts', quizAttempts), [quizAttempts]);
  useEffect(() => saveToStorage('attendance', attendance), [attendance]);
  useEffect(() => saveToStorage('live_classes', liveClasses), [liveClasses]);
  useEffect(() => saveToStorage('doubts', doubts), [doubts]);
  useEffect(() => saveToStorage('completed_map', completedMap), [completedMap]);
  useEffect(() => saveToStorage('is_admin_auth', isAdminAuthenticated), [isAdminAuthenticated]);
  useEffect(() => saveToStorage('current_student_id', currentStudentId), [currentStudentId]);
  useEffect(() => saveToStorage('role', role), [role]);

  const currentStudent = currentStudentId
    ? students.find((s) => s.id === currentStudentId) || null
    : null;
  const completedMaterialIds = currentStudent ? (completedMap[currentStudent.id] || []) : [];

  const signUpStudent = (studentData: Omit<Student, 'id' | 'enrolledAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      enrolledAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    setCurrentStudentId(newStudent.id);
    setRole('student');
    return newStudent;
  };

  const loginStudent = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setCurrentStudentId(found.id);
      setRole('student');
    }
  };

  const loginAdmin = (password: string): boolean => {
    if (verifyAdminPassword(password)) {
      setIsAdminAuthenticated(true);
      setRole('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('guest');
    setIsAdminAuthenticated(false);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'enrolledAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      enrolledAt: new Date().toISOString().split('T')[0],
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (currentStudentId === id) {
      setCurrentStudentId(students.find((s) => s.id !== id)?.id || null);
    }
  };

  const addMaterial = (mat: Omit<Material, 'id' | 'uploadedAt'>) => {
    const newMat: Material = {
      ...mat,
      id: `mat-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMaterialCompleted = (materialId: string) => {
    if (!currentStudent) return;
    setCompletedMap((prev) => {
      const studentList = prev[currentStudent.id] || [];
      const isCompleted = studentList.includes(materialId);
      const updated = isCompleted
        ? studentList.filter((id) => id !== materialId)
        : [...studentList, materialId];
      return { ...prev, [currentStudent.id]: updated };
    });
  };

  const addAssignment = (asg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const submitAssignmentWork = (assignmentId: string, content: string, fileAttachment?: string) => {
    if (!currentStudent) return;
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === currentStudent.id
    );

    const submission: Submission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      submittedAt: new Date().toISOString(),
      workContent: content,
      fileAttachment,
      status: 'submitted',
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) => prev.map((s, idx) => (idx === existingIndex ? submission : s)));
    } else {
      setSubmissions((prev) => [submission, ...prev]);
    }
  };

  const gradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, grade, teacherFeedback: feedback, status: 'graded' }
          : s
      )
    );
  };

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const submitQuiz = (
    quizId: string,
    answers: Record<string, number>,
    score: number,
    maxScore: number,
    percentage: number
  ) => {
    if (!currentStudent) return;
    const attempt: QuizAttempt = {
      id: `attp-${Date.now()}`,
      quizId,
      studentId: currentStudent.id,
      score,
      maxScore,
      percentage,
      completedAt: new Date().toISOString(),
      answers,
    };
    setQuizAttempts((prev) => [attempt, ...prev]);
  };

  const markAttendanceBatch = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`,
    }));

    // Replace matching dates and students or append
    setAttendance((prev) => {
      const filtered = prev.filter(
        (existing) =>
          !records.some((r) => r.date === existing.date && r.studentId === existing.studentId)
      );
      return [...newRecords, ...filtered];
    });
  };

  const updateAttendanceSingle = (
    date: string,
    studentId: string,
    status: AttendanceRecord['status'],
    note?: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setAttendance((prev) => {
      const existingIdx = prev.findIndex((r) => r.date === date && r.studentId === studentId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          note: note !== undefined ? note : updated[existingIdx].note,
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}`,
          date,
          studentId,
          studentName: student.name,
          batch: student.batch,
          status,
          note,
        };
        return [newRecord, ...prev];
      }
    });
  };

  const addLiveClass = (liveClassData: Omit<LiveClassNotification, 'id' | 'createdAt'>) => {
    const newLive: LiveClassNotification = {
      ...liveClassData,
      id: `live-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLiveClasses((prev) => [newLive, ...prev]);
  };

  const deleteLiveClass = (id: string) => {
    setLiveClasses((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleLiveNow = (id: string) => {
    setLiveClasses((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isLiveNow: !l.isLiveNow } : l))
    );
  };

  const addDoubt = (subject: string, question: string) => {
    if (!currentStudent) return;
    const newDoubt: StudentDoubt = {
      id: `dbt-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      subject,
      question,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setDoubts((prev) => [newDoubt, ...prev]);
  };

  const replyToDoubt = (doubtId: string, reply: string) => {
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              teacherReply: reply,
              repliedAt: new Date().toISOString(),
              status: 'resolved',
            }
          : d
      )
    );
  };

  return (
    <TuitionContext.Provider
      value={{
        role,
        currentStudent,
        isAdminAuthenticated,
        students,
        materials,
        assignments,
        submissions,
        quizzes,
        quizAttempts,
        attendance,
        liveClasses,
        doubts,
        completedMaterialIds,
        signUpStudent,
        loginStudent,
        loginAdmin,
        logout,
        setRole,
        addStudent,
        updateStudent,
        deleteStudent,
        addMaterial,
        deleteMaterial,
        toggleMaterialCompleted,
        addAssignment,
        deleteAssignment,
        submitAssignmentWork,
        gradeSubmission,
        addQuiz,
        deleteQuiz,
        submitQuiz,
        markAttendanceBatch,
        updateAttendanceSingle,
        addLiveClass,
        deleteLiveClass,
        toggleLiveNow,
        addDoubt,
        replyToDoubt,
      }}
    >
      {children}
    </TuitionContext.Provider>
  );
};

export const useTuition = () => {
  const context = useContext(TuitionContext);
  if (!context) {
    throw new Error('useTuition must be used within a TuitionProvider');
  }
  return context;
};
