import { Question } from './types';
import { formatQuestionsForStorage } from './questionsLoader';

// Storage key for the local storage
const QUESTIONS_STORAGE_KEY = 'qudratak_questions';

// Interface for data stored in local storage
interface QuestionStoreData {
  questions: Question[];
  lastId: number;
}

// تحميل الأسئلة من ملف JSON الخارجي
const allQuestionsFromFile = formatQuestionsForStorage();

// Initial store data with preloaded questions from file
const initialStoreData: QuestionStoreData = {
  questions: allQuestionsFromFile,
  lastId: allQuestionsFromFile.length > 0 ? Math.max(...allQuestionsFromFile.map(q => q.id)) : 0
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
  // Get questions directly from JSON file without localStorage
  getQuestionsFromFile: (): Question[] => {
    return formatQuestionsForStorage();
  },
  
  // Get verbal questions directly from JSON file
  getVerbalQuestionsFromFile: (): Question[] => {
    return formatQuestionsForStorage().filter(q => q.type === 'verbal');
  },
  
  // Get quantitative questions directly from JSON file
  getQuantitativeQuestionsFromFile: (): Question[] => {
    return formatQuestionsForStorage().filter(q => q.type === 'quantitative');
  },
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
  
  // Export questions to JSON string for backup
  exportQuestionsToJSON: (): string => {
    const { questions } = getStoreData();
    
    // تقسيم الأسئلة حسب النوع
    const verbalQuestions = questions.filter(q => q.type === 'verbal')
      .map(({ id, text, options, correctOptionIndex }) => ({ id, text, options, correctOptionIndex }));
      
    const quantitativeQuestions = questions.filter(q => q.type === 'quantitative')
      .map(({ id, text, options, correctOptionIndex }) => ({ id, text, options, correctOptionIndex }));
      
    // إنشاء كائن التصدير
    const exportObject = {
      verbal: verbalQuestions,
      quantitative: quantitativeQuestions
    };
    
    return JSON.stringify(exportObject, null, 2);
  },
  
  // For debugging: Inject test questions
  injectSampleQuestions: (): void => {
    const storeData = getStoreData();
    
    // If we already have questions, don't inject samples
    if (storeData.questions.length > 0) {
      return;
    }
    
    // تحميل الأسئلة من ملف JSON مباشرة
    const freshQuestions = formatQuestionsForStorage();
    
    storeData.questions = freshQuestions;
    storeData.lastId = freshQuestions.length > 0 ? Math.max(...freshQuestions.map(q => q.id)) : 0;
    
    saveStoreData(storeData);
  }
};
