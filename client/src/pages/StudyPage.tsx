
import React from 'react';
import { QuestionStore } from '../lib/questionStore';
import { Question } from '../lib/types';

const StudyPage: React.FC = () => {
  const allQuestions = QuestionStore.getAll();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">تعلم الأسئلة</h1>
      <div className="grid gap-6">
        {allQuestions.map((question: Question) => (
          <div key={question.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">{question.text}</h3>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div 
                  key={index}
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
