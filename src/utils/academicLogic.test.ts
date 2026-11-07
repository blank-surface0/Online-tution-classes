import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminPassword,
  calculateAttendanceRate,
  calculateStudentProgress,
  gradeQuiz,
  getLiveClassStatus,
  ADMIN_PASS,
} from './academicLogic';
import { AttendanceRecord, QuizQuestion } from '../types';

test('verifyAdminPassword accurately validates password', () => {
  assert.equal(verifyAdminPassword('shakir7930'), true);
  assert.equal(verifyAdminPassword('  shakir7930  '), true);
  assert.equal(verifyAdminPassword('wrongpass'), false);
  assert.equal(verifyAdminPassword(''), false);
  assert.equal(ADMIN_PASS, 'shakir7930');
});

test('calculateAttendanceRate computes accurate percentages', () => {
  const records: AttendanceRecord[] = [
    { id: '1', date: '2026-11-01', studentId: 's1', studentName: 'Aarav', batch: 'Grade 10', status: 'present' },
    { id: '2', date: '2026-11-02', studentId: 's1', studentName: 'Aarav', batch: 'Grade 10', status: 'present' },
    { id: '3', date: '2026-11-03', studentId: 's1', studentName: 'Aarav', batch: 'Grade 10', status: 'absent' },
    { id: '4', date: '2026-11-04', studentId: 's1', studentName: 'Aarav', batch: 'Grade 10', status: 'late' },
    { id: '5', date: '2026-11-01', studentId: 's2', studentName: 'Zainab', batch: 'Grade 10', status: 'present' },
  ];

  const result = calculateAttendanceRate(records, 's1');
  assert.equal(result.total, 4);
  assert.equal(result.present, 2);
  assert.equal(result.absent, 1);
  assert.equal(result.late, 1);
  // (2 + 1 * 0.75) / 4 = 2.75 / 4 = 68.75% -> 69%
  assert.equal(result.rate, 69);

  // Student with no records defaults safely to 100%
  const emptyResult = calculateAttendanceRate(records, 's999');
  assert.equal(emptyResult.rate, 100);
});

test('calculateStudentProgress aggregates materials, assignments, and quizzes correctly', () => {
  const progress = calculateStudentProgress(
    ['m1', 'm2'], // 2 out of 4 materials = 50%
    4,
    ['a1'], // 1 out of 2 assignments = 50%
    2,
    ['q1'], // 1 out of 1 quiz = 100%
    1
  );

  assert.equal(progress.materialsPct, 50);
  assert.equal(progress.assignmentsPct, 50);
  assert.equal(progress.quizzesPct, 100);
  // Overall = 50 * 0.3 + 50 * 0.4 + 100 * 0.3 = 15 + 20 + 30 = 65%
  assert.equal(progress.overallPct, 65);
});

test('gradeQuiz accurately scores multiple choice submissions', () => {
  const questions: QuizQuestion[] = [
    { id: 'q1', question: '2 + 2?', options: ['3', '4', '5'], correctIndex: 1 },
    { id: 'q2', question: 'Speed of light?', options: ['3x10^8 m/s', '300 m/s'], correctIndex: 0 },
    { id: 'q3', question: 'H2O is?', options: ['Salt', 'Water', 'Acid'], correctIndex: 1 },
  ];

  const passingAnswers = { q1: 1, q2: 0, q3: 1 };
  const res1 = gradeQuiz(questions, passingAnswers);
  assert.equal(res1.score, 3);
  assert.equal(res1.maxScore, 3);
  assert.equal(res1.percentage, 100);
  assert.equal(res1.passed, true);

  const failingAnswers = { q1: 0, q2: 1, q3: 1 };
  const res2 = gradeQuiz(questions, failingAnswers);
  assert.equal(res2.score, 1);
  assert.equal(res2.percentage, 33);
  assert.equal(res2.passed, false);
});

test('getLiveClassStatus identifies live, upcoming and ended classes', () => {
  const now = new Date('2026-11-07T10:00:00.000Z');

  // Currently live
  const statusLive = getLiveClassStatus('2026-11-07T09:45:00.000Z', 60, now);
  assert.equal(statusLive, 'live');

  // In future
  const statusUpcoming = getLiveClassStatus('2026-11-07T11:00:00.000Z', 60, now);
  assert.equal(statusUpcoming, 'upcoming');

  // Finished in past
  const statusEnded = getLiveClassStatus('2026-11-07T08:00:00.000Z', 60, now);
  assert.equal(statusEnded, 'ended');
});
