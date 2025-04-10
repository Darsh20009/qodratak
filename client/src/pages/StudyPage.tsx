
import React from 'react';
import { QuestionStore } from '../lib/questionStore';
import { Question } from '../lib/types';
import { useLocation } from 'wouter';

const StudyPage: React.FC = () => {
  const allQuestions = QuestionStore.getAll();
  const [, setLocation] = useLocation();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setLocation('/dashboard')}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة للصفحة الرئيسية
        </button>
        <img src="/logo.png" alt="قدراتك" className="h-12" />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">تعلم الأسئلة</h1>
      <div className="grid gap-6">
        {allQuestions.map((question: Question) => (
          <div key={question.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">{question.text}</h3>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div 
                  key={`${question.id}-${index}`}
                  className={`p-2 rounded ${
                    index === question.correctOptionIndex 
                      ? 'bg-green-100 border border-green-500' 
                      : 'bg-gray-50'
                  }`}
                >
                  {option}
                  {index === question.correctOptionIndex && (
                    <span className="text-green-600 mr-2">(الإجابة الصحيحة)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPage;
