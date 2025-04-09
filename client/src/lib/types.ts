export interface User {
  id: number;
  username: string;
  name: string;
  isAdmin: boolean;
  password?: string; // اختياري لأغراض الإنشاء فقط
}

export interface Question {
  id: number;
  type: 'verbal' | 'quantitative';
  text: string;
  options: string[];
  correctOptionIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestConfig {
  type?: 'standard' | 'custom' | 'qiyas';
  verbalQuestions: number;
  quantitativeQuestions: number;
  duration: number;
  sections?: TestSection[];
}

export interface TestSession {
  questions: Question[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime: Date;
  userAnswers: (number | null)[];
}

export interface TestSection {
  id: number;
  type: 'verbal' | 'quantitative';
  questionsCount: number;
  duration: number; // in minutes
}

export type ActiveView = 'login' | 'studentDashboard' | 'testPage' | 'adminPanel';
