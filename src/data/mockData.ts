import {
  Student,
  Material,
  Assignment,
  Quiz,
  AttendanceRecord,
  LiveClassNotification,
  StudentDoubt,
  Submission,
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 43219',
    grade: 'Grade 11',
    batch: 'Morning Elite Batch',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    enrolledAt: '2026-09-01',
    notes: 'Excels in algebra; needs practice with calculus integration techniques.',
  },
  {
    id: 'std-2',
    name: 'Zainab Fatima',
    email: 'zainab.f@example.com',
    phone: '+91 98111 22334',
    parentPhone: '+91 98111 22330',
    grade: 'Grade 12',
    batch: 'Morning Elite Batch',
    subjects: ['Physics', 'Mathematics'],
    enrolledAt: '2026-08-15',
    notes: 'Very consistent, high quiz performance.',
  },
  {
    id: 'std-3',
    name: 'Kabir Patel',
    email: 'kabir.p@example.com',
    phone: '+91 97234 56789',
    parentPhone: '+91 97234 56780',
    grade: 'Grade 10',
    batch: 'Evening Foundation Batch',
    subjects: ['Mathematics', 'Science', 'English'],
    enrolledAt: '2026-09-10',
    notes: 'Preparing for board exams.',
  },
  {
    id: 'std-4',
    name: 'Sara Khan',
    email: 'sara.khan@example.com',
    phone: '+91 98321 65498',
    parentPhone: '+91 98321 65490',
    grade: 'Grade 11',
    batch: 'Morning Elite Batch',
    subjects: ['Chemistry', 'Biology', 'Physics'],
    enrolledAt: '2026-09-20',
    notes: 'Strong laboratory skills and theoretical grasp.',
  },
  {
    id: 'std-5',
    name: 'Reyansh Verma',
    email: 'reyansh.v@example.com',
    phone: '+91 99887 76655',
    parentPhone: '+91 99887 76650',
    grade: 'Grade 12',
    batch: 'Weekend Booster Batch',
    subjects: ['Mathematics', 'Physics'],
    enrolledAt: '2026-10-01',
    notes: 'Fast learner, preparing for competitive engineering entrance.',
  },
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    title: 'Calculus Fundamentals: Limits, Continuity & Derivatives',
    subject: 'Mathematics',
    topic: 'Differential Calculus',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM', // Educational Khan Academy calculus video
    uploadedAt: '2026-11-01',
    duration: '32 mins',
    authorName: 'Master Tutor Shakir',
    content: 'Comprehensive walkthrough covering the epsilon-delta intuition, algebraic limit evaluation methods, and standard differentiation formulas with past paper examples.',
  },
  {
    id: 'mat-2',
    title: 'Newtonian Mechanics & Free Body Diagrams Masterclass',
    subject: 'Physics',
    topic: 'Laws of Motion',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds', // Physics crash course video
    uploadedAt: '2026-11-03',
    duration: '28 mins',
    authorName: 'Master Tutor Shakir',
    content: 'Learn how to isolate forces on inclined planes, pulley systems, and friction constraints step-by-step.',
  },
  {
    id: 'mat-3',
    title: 'Organic Chemistry: Reaction Mechanisms & Functional Groups Summary Sheet',
    subject: 'Chemistry',
    topic: 'Organic Synthesis',
    type: 'pdf',
    fileUrl: 'https://example.com/materials/organic-chemistry-summary.pdf',
    uploadedAt: '2026-11-04',
    fileSize: '4.2 MB',
    authorName: 'Master Tutor Shakir',
    content: 'High-yield color coded chart covering SN1, SN2, E1, E2 mechanisms with key nucleophiles and solvent effects.',
  },
  {
    id: 'mat-4',
    title: 'Trigonometry Identities & Compound Angles Revision Notes',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    type: 'notes',
    uploadedAt: '2026-11-05',
    fileSize: '1.8 MB',
    authorName: 'Master Tutor Shakir',
    content: 'Full derivation sheet for double angle formulas, sum-to-product transforms, and trigonometric equation solution techniques.',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Assignment 04: Derivatives & Rate of Change Problem Set',
    subject: 'Mathematics',
    description: 'Solve problems 1 through 15 from Section 4.2. Show complete working for chain rule, product rule, and implicit differentiation.',
    dueDate: '2026-11-12',
    totalMarks: 50,
    status: 'active',
    createdAt: '2026-11-02',
  },
  {
    id: 'asg-2',
    title: 'Physics Lab Writeup: Coefficient of Kinetic Friction Investigation',
    subject: 'Physics',
    description: 'Tabulate the experimental acceleration values, plot the normal force versus friction graph, and compute the static and kinetic coefficients with percentage error.',
    dueDate: '2026-11-15',
    totalMarks: 40,
    status: 'active',
    createdAt: '2026-11-04',
  },
  {
    id: 'asg-3',
    title: 'Chemistry Problem Set: Hydrocarbons & Isomerism',
    subject: 'Chemistry',
    description: 'Draw all structural and stereo-isomers for C5H10 and explain the boiling point trends based on intermolecular forces.',
    dueDate: '2026-11-18',
    totalMarks: 30,
    status: 'active',
    createdAt: '2026-11-06',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    submittedAt: '2026-11-05T14:30:00.000Z',
    workContent: 'Completed questions 1-15. Used implicit differentiation on Q12 yielding dy/dx = (2x - y)/(x + 2y). Hand-drawn graphs and step-by-step calculus attached.',
    status: 'graded',
    grade: 48,
    teacherFeedback: 'Outstanding analytical clarity! Q12 solution is elegant. Watch out for the negative sign in problem 7 part b.',
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-2',
    studentId: 'std-2',
    studentName: 'Zainab Fatima',
    submittedAt: '2026-11-06T18:15:00.000Z',
    workContent: 'Calculated kinetic friction coefficient mu_k = 0.285 +/- 0.02. Attached experimental data points and linear regression plot.',
    status: 'graded',
    grade: 39,
    teacherFeedback: 'Very thorough error analysis and neatly structured graphs. Full marks for experimental methodology.',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Physics Checkpoint: Vectors, Forces & Equilibrium',
    subject: 'Physics',
    topic: 'Mechanics',
    timeLimitMinutes: 15,
    dueDate: '2026-11-14',
    createdAt: '2026-11-03',
    questions: [
      {
        id: 'q1-1',
        question: 'A 10 kg box rests on a horizontal frictionless surface. A 50 N horizontal force is applied. What is its acceleration?',
        options: ['2 m/s²', '5 m/s²', '10 m/s²', '500 m/s²'],
        correctIndex: 1,
        explanation: 'By Newton\'s Second Law, a = F / m = 50 N / 10 kg = 5 m/s².',
      },
      {
        id: 'q1-2',
        question: 'Which of the following is a vector quantity?',
        options: ['Mass', 'Speed', 'Velocity', 'Energy'],
        correctIndex: 2,
        explanation: 'Velocity has both magnitude and direction, making it a vector.',
      },
      {
        id: 'q1-3',
        question: 'When an object is in translational equilibrium, what must be true about the net force acting on it?',
        options: ['Net force is equal to mass', 'Net force is zero', 'Net force is constantly increasing', 'Net force depends on velocity'],
        correctIndex: 1,
        explanation: 'Translational equilibrium means acceleration is zero, hence sum of forces = 0.',
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Mathematics Drill: Quadratic Functions & Complex Roots',
    subject: 'Mathematics',
    topic: 'Algebra',
    timeLimitMinutes: 12,
    dueDate: '2026-11-16',
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'q2-1',
        question: 'If the discriminant of ax² + bx + c = 0 is negative (b² - 4ac < 0), what is the nature of the roots?',
        options: ['Two real and distinct roots', 'Two real and equal roots', 'Two complex conjugate roots', 'Infinitely many roots'],
        correctIndex: 2,
        explanation: 'A negative discriminant indicates no real intercepts on the x-axis, resulting in a pair of complex conjugates.',
      },
      {
        id: 'q2-2',
        question: 'What is the vertex coordinate of the parabola y = 2(x - 3)² + 5?',
        options: ['(-3, 5)', '(3, 5)', '(3, -5)', '(2, 5)'],
        correctIndex: 1,
        explanation: 'In vertex form y = a(x - h)² + k, the vertex is (h, k), so (3, 5).',
      },
      {
        id: 'q2-3',
        question: 'What is the product of the roots of the equation 3x² - 12x + 9 = 0?',
        options: ['4', '-4', '3', '-3'],
        correctIndex: 2,
        explanation: 'By Vieta\'s formulas, product of roots = c / a = 9 / 3 = 3.',
      },
    ],
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Aarav (std-1)
  { id: 'att-1', date: '2026-11-02', studentId: 'std-1', studentName: 'Aarav Sharma', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-2', date: '2026-11-03', studentId: 'std-1', studentName: 'Aarav Sharma', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-3', date: '2026-11-04', studentId: 'std-1', studentName: 'Aarav Sharma', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-4', date: '2026-11-05', studentId: 'std-1', studentName: 'Aarav Sharma', batch: 'Morning Elite Batch', status: 'late', note: 'Joined 10 mins late due to rain' },
  { id: 'att-5', date: '2026-11-06', studentId: 'std-1', studentName: 'Aarav Sharma', batch: 'Morning Elite Batch', status: 'present' },

  // Zainab (std-2)
  { id: 'att-6', date: '2026-11-02', studentId: 'std-2', studentName: 'Zainab Fatima', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-7', date: '2026-11-03', studentId: 'std-2', studentName: 'Zainab Fatima', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-8', date: '2026-11-04', studentId: 'std-2', studentName: 'Zainab Fatima', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-9', date: '2026-11-05', studentId: 'std-2', studentName: 'Zainab Fatima', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-10', date: '2026-11-06', studentId: 'std-2', studentName: 'Zainab Fatima', batch: 'Morning Elite Batch', status: 'present' },

  // Kabir (std-3)
  { id: 'att-11', date: '2026-11-02', studentId: 'std-3', studentName: 'Kabir Patel', batch: 'Evening Foundation Batch', status: 'present' },
  { id: 'att-12', date: '2026-11-03', studentId: 'std-3', studentName: 'Kabir Patel', batch: 'Evening Foundation Batch', status: 'absent', note: 'Family function' },
  { id: 'att-13', date: '2026-11-04', studentId: 'std-3', studentName: 'Kabir Patel', batch: 'Evening Foundation Batch', status: 'present' },
  { id: 'att-14', date: '2026-11-05', studentId: 'std-3', studentName: 'Kabir Patel', batch: 'Evening Foundation Batch', status: 'present' },
  { id: 'att-15', date: '2026-11-06', studentId: 'std-3', studentName: 'Kabir Patel', batch: 'Evening Foundation Batch', status: 'present' },

  // Sara (std-4)
  { id: 'att-16', date: '2026-11-02', studentId: 'std-4', studentName: 'Sara Khan', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-17', date: '2026-11-03', studentId: 'std-4', studentName: 'Sara Khan', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-18', date: '2026-11-04', studentId: 'std-4', studentName: 'Sara Khan', batch: 'Morning Elite Batch', status: 'excused', note: 'Doctor appointment' },
  { id: 'att-19', date: '2026-11-05', studentId: 'std-4', studentName: 'Sara Khan', batch: 'Morning Elite Batch', status: 'present' },
  { id: 'att-20', date: '2026-11-06', studentId: 'std-4', studentName: 'Sara Khan', batch: 'Morning Elite Batch', status: 'present' },

  // Reyansh (std-5)
  { id: 'att-21', date: '2026-11-02', studentId: 'std-5', studentName: 'Reyansh Verma', batch: 'Weekend Booster Batch', status: 'present' },
  { id: 'att-22', date: '2026-11-03', studentId: 'std-5', studentName: 'Reyansh Verma', batch: 'Weekend Booster Batch', status: 'late' },
  { id: 'att-23', date: '2026-11-04', studentId: 'std-5', studentName: 'Reyansh Verma', batch: 'Weekend Booster Batch', status: 'present' },
  { id: 'att-24', date: '2026-11-05', studentId: 'std-5', studentName: 'Reyansh Verma', batch: 'Weekend Booster Batch', status: 'present' },
  { id: 'att-25', date: '2026-11-06', studentId: 'std-5', studentName: 'Reyansh Verma', batch: 'Weekend Booster Batch', status: 'absent' },
];

export const INITIAL_LIVE_CLASSES: LiveClassNotification[] = [
  {
    id: 'live-1',
    title: 'Live Interactive Session: Calculus Maxima & Minima Applications',
    subject: 'Mathematics',
    batch: 'Morning Elite Batch',
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    durationMinutes: 60,
    joinUrl: 'https://meet.google.com/xyz-tuition-room',
    instructor: 'Master Tutor Shakir',
    isLiveNow: true,
    notes: 'Please keep your notebook and scientific calculator ready. We will solve 5 previous year exam problems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'live-2',
    title: 'Physics Doubts & Numerical Problem Solving Live Lab',
    subject: 'Physics',
    batch: 'All Batches',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    durationMinutes: 75,
    joinUrl: 'https://meet.google.com/abc-tuition-lab',
    instructor: 'Master Tutor Shakir',
    isLiveNow: false,
    notes: 'Open doubt-clearing forum. Submit questions in the doubts tab prior to class.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DOUBTS: StudentDoubt[] = [
  {
    id: 'dbt-1',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    subject: 'Mathematics',
    question: 'Sir, when do we know whether to use integration by parts versus substitution method when an exponential and polynomial are multiplied together?',
    createdAt: '2026-11-06T11:20:00.000Z',
    status: 'resolved',
    teacherReply: 'Great question Aarav! Use the LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential). When you have x*e^x, polynomial x comes before exponential e^x, so set u = x and dv = e^x dx. Substitution is only used when the derivative of the inner function is already present as an outer multiplier.',
    repliedAt: '2026-11-06T12:05:00.000Z',
  },
  {
    id: 'dbt-2',
    studentId: 'std-3',
    studentName: 'Kabir Patel',
    subject: 'Physics',
    question: 'How does tension in a rope stay constant across a frictionless massless pulley?',
    createdAt: '2026-11-07T08:15:00.000Z',
    status: 'pending',
    aiHint: 'Because the pulley is ideal (massless and frictionless), no net torque is required to rotate it. Therefore T1 - T2 = I*alpha = 0, meaning T1 must equal T2 throughout the cord.',
  },
];
