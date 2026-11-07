import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment.');
    }
    genAI = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

// AI Endpoint: Student Doubt Solver / Explainer
app.post('/api/gemini/doubt-solver', async (req, res) => {
  try {
    const { question, subject, studentGrade, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGenAI();
    const prompt = `You are a friendly, encouraging expert tuition teacher at Apex Tuition Academy.
Subject: ${subject || 'General Academic'}
Student Grade/Level: ${studentGrade || 'High School / Secondary'}
Context/Topic: ${context || 'None specified'}

Student's Question/Doubt:
"${question}"

Please provide a clear, supportive response:
1. Direct, easy-to-understand explanation with intuitive analogies or examples.
2. Step-by-step working if it's math/science/grammar.
3. Key takeaway or mnemonic to remember.
4. One quick practice question to test their understanding.
Keep the tone encouraging, concise, and academically rigorous.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a warm, highly pedagogical private tutor helping students understand difficult academic concepts clearly and confidently.',
      },
    });

    res.json({ answer: response.text || 'No answer generated.' });
  } catch (error: any) {
    console.error('Error in doubt-solver:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate tutor response. Please try again.',
    });
  }
});

// AI Endpoint: Quiz Generator for Admin / Teacher
app.post('/api/gemini/quiz-generator', async (req, res) => {
  try {
    const { subject, topic, questionCount = 3, difficulty = 'Medium' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getGenAI();
    const prompt = `Generate a high quality academic multiple-choice quiz for tuition students.
Subject: ${subject || 'General'}
Topic: ${topic}
Number of questions: ${Math.min(Number(questionCount) || 3, 5)}
Difficulty: ${difficulty}

Return strictly a valid JSON array of question objects with NO markdown formatting, NO backticks.
Format:
[
  {
    "id": "q1",
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Clear explanation why Option A is correct."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let quizData = [];
    try {
      quizData = JSON.parse(response.text || '[]');
    } catch {
      quizData = [];
    }

    res.json({ questions: quizData });
  } catch (error: any) {
    console.error('Error in quiz-generator:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate quiz.',
    });
  }
});

// AI Endpoint: Assignment Feedback & Marking Helper
app.post('/api/gemini/assignment-feedback', async (req, res) => {
  try {
    const { assignmentTitle, studentSubmission, rubric } = req.body;
    if (!studentSubmission) {
      return res.status(400).json({ error: 'Submission content is required' });
    }

    const ai = getGenAI();
    const prompt = `You are a teacher evaluating a student assignment at Apex Tuition Academy.
Assignment Title: ${assignmentTitle || 'Coursework Submission'}
Evaluation Focus: ${rubric || 'Accuracy, clarity, methodology, and completeness'}

Student Submission:
"""
${studentSubmission}
"""

Provide constructive teacher feedback:
1. Strengths observed (2 bullet points)
2. Areas for improvement or corrections (2 bullet points)
3. Suggested score out of 100 with justification.
4. Encouraging sign-off note from the teacher.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ feedback: response.text || 'No feedback generated.' });
  } catch (error: any) {
    console.error('Error in assignment-feedback:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate feedback.',
    });
  }
});

// AI Endpoint: Student Progress Insights for Admin
app.post('/api/gemini/student-progress-summary', async (req, res) => {
  try {
    const { studentName, attendanceRate, completedTasks, totalTasks, quizAverage, subject } = req.body;
    
    const ai = getGenAI();
    const prompt = `Write a concise 3-sentence academic tutor progress review for student "${studentName}".
Subject: ${subject || 'Core Subjects'}
Attendance Rate: ${attendanceRate}%
Completed Coursework: ${completedTasks} out of ${totalTasks} items
Quiz Average: ${quizAverage}%

Include:
1. Current engagement assessment.
2. Specific recommendation to boost performance or maintain consistency.
3. A motivating note to share with student/parents.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ summary: response.text || 'No summary generated.' });
  } catch (error: any) {
    console.error('Error in student-progress-summary:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate progress summary.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Apex Tuition Server running on http://localhost:${PORT}`);
  });
}

startServer();
