import questionsData from '../data/questions_all.json';
import { Question } from './types';

/**
 * وظيفة لتحميل الأسئلة من ملف البيانات
 */
export function loadAllQuestions(): {
  verbal: Question[],
  quantitative: Question[]
} {
  // إضافة حقول createdAt و updatedAt للأسئلة
  const now = new Date().toISOString();
  
  const verbalQuestions = questionsData.verbal.map(q => ({
    ...q,
    type: 'verbal' as const,
    createdAt: now,
    updatedAt: now
  }));
  
  const quantitativeQuestions = questionsData.quantitative.map(q => ({
    ...q,
    type: 'quantitative' as const,
    createdAt: now,
    updatedAt: now
  }));
  
  return {
    verbal: verbalQuestions,
    quantitative: quantitativeQuestions
  };
}

/**
 * وظيفة لتعديل تنسيق قاعدة البيانات للاستخدام في التطبيق
 */
export function formatQuestionsForStorage(): Question[] {
  const { verbal, quantitative } = loadAllQuestions();
  return [...verbal, ...quantitative];
}