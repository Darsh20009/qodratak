import { Question } from './types';

// Storage key for the local storage
const QUESTIONS_STORAGE_KEY = 'qudratak_questions';

// Interface for data stored in local storage
interface QuestionStoreData {
  questions: Question[];
  lastId: number;
}

// Initial store data
const initialStoreData: QuestionStoreData = {
  questions: [],
  lastId: 0
};

// Function to get the store data
const getStoreData = (): QuestionStoreData => {
  const storedData = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  
  if (!storedData) {
    return initialStoreData;
  }
  
  try {
    return JSON.parse(storedData) as QuestionStoreData;
  } catch (error) {
    console.error('Error parsing question data from localStorage:', error);
    return initialStoreData;
  }
};

// Function to save the store data
const saveStoreData = (data: QuestionStoreData): void => {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(data));
};

// Question Store API
export const QuestionStore = {
  // Get all questions
  getAll: (): Question[] => {
    const { questions } = getStoreData();
    return questions;
  },
  
  // Get questions by type
  getByType: (type: 'verbal' | 'quantitative'): Question[] => {
    const { questions } = getStoreData();
    return questions.filter(q => q.type === type);
  },
  
  // Get a question by ID
  getById: (id: number): Question | undefined => {
    const { questions } = getStoreData();
    return questions.find(q => q.id === id);
  },
  
  // Add a new question
  add: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question => {
    const storeData = getStoreData();
    const newId = storeData.lastId + 1;
    
    const now = new Date().toISOString();
    const newQuestion: Question = {
      ...question,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    storeData.questions.push(newQuestion);
    storeData.lastId = newId;
    
    saveStoreData(storeData);
    return newQuestion;
  },
  
  // Update a question
  update: (id: number, questionData: Partial<Question>): Question | null => {
    const storeData = getStoreData();
    const questionIndex = storeData.questions.findIndex(q => q.id === id);
    
    if (questionIndex === -1) {
      return null;
    }
    
    const updatedQuestion: Question = {
      ...storeData.questions[questionIndex],
      ...questionData,
      updatedAt: new Date().toISOString()
    };
    
    storeData.questions[questionIndex] = updatedQuestion;
    saveStoreData(storeData);
    
    return updatedQuestion;
  },
  
  // Delete a question
  delete: (id: number): boolean => {
    const storeData = getStoreData();
    const initialLength = storeData.questions.length;
    
    storeData.questions = storeData.questions.filter(q => q.id !== id);
    
    if (storeData.questions.length === initialLength) {
      return false;
    }
    
    saveStoreData(storeData);
    return true;
  },
  
  // Search questions by text
  search: (query: string): Question[] => {
    if (!query.trim()) {
      return QuestionStore.getAll();
    }
    
    const { questions } = getStoreData();
    const lowerQuery = query.toLowerCase();
    
    return questions.filter(q => 
      q.text.toLowerCase().includes(lowerQuery) || 
      q.options.some(opt => opt.toLowerCase().includes(lowerQuery))
    );
  },
  
  // For debugging: Force storage refresh
  forceRefresh: (): void => {
    saveStoreData(getStoreData());
  },
  
  // For debugging: Get storage state
  getDebugInfo: (): { totalQuestions: number, byType: Record<string, number> } => {
    const { questions } = getStoreData();
    
    const byType: Record<string, number> = questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalQuestions: questions.length,
      byType
    };
  },
  
  // For debugging: Reset storage (clear all questions)
  reset: (): void => {
    saveStoreData(initialStoreData);
  },
  
  // For debugging: Inject test questions
  injectSampleQuestions: (): void => {
    const storeData = getStoreData();
    
    // If we already have questions, don't inject samples
    if (storeData.questions.length > 0) {
      return;
    }
    
    const sampleQuestions: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: 'verbal',
        text: 'ما هو مرادف كلمة "نضب" في اللغة العربية؟',
        options: ['فاض', 'نفد', 'استمر', 'تراكم'],
        correctOptionIndex: 1
      },
      {
        type: 'quantitative',
        text: 'إذا كان س + ص = 15 و س - ص = 3، فما قيمة س؟',
        options: ['6', '9', '12', '15'],
        correctOptionIndex: 1
      }
    ];
    
    let lastId = storeData.lastId;
    const now = new Date().toISOString();
    
    for (const q of sampleQuestions) {
      lastId++;
      storeData.questions.push({
        ...q,
        id: lastId,
        createdAt: now,
        updatedAt: now
      });
    }
    
    storeData.lastId = lastId;
    saveStoreData(storeData);
  }
};
