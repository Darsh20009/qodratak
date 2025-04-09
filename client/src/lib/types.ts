export interface User {
  id: number;
  username: string;
  name: string;
  isAdmin: boolean;
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
  verbalQuestions: number;
  quantitativeQuestions: number;
  duration: number;
}

export interface TestSession {
  questions: Question[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime: Date;
  userAnswers: (number | null)[];
}

export type ActiveView = 'login' | 'studentDashboard' | 'testPage' | 'adminPanel';
