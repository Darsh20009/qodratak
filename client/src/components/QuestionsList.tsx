import { Question } from '../lib/types';

interface QuestionsListProps {
  questions: Question[];
  loading: boolean;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-8">جاري تحميل الأسئلة...</div>;
  }
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد أسئلة متطابقة مع المعايير المحددة
      </div>
    );
  }

  return (
    <div className="questions-list space-y-4 mb-8">
      {questions.map((question) => (
        <div key={question.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-sm transition bg-white">
          <div className="flex justify-between">
            <span className={`text-white text-xs py-1 px-2 rounded-full ${question.type === 'verbal' ? 'bg-blue-400' : 'bg-purple-400'}`}>
              {question.type === 'verbal' ? 'لفظي' : 'كمي'}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(question)}
                className="text-blue-500 hover:text-blue-600 transition"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                onClick={() => onDelete(question.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <h4 className="text-lg font-medium mt-2">{question.text}</h4>
          
          <div className="mt-3 space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-700 ml-2">
                  {index === 0 ? 'أ.' : index === 1 ? 'ب.' : index === 2 ? 'ج.' : 'د.'}
                </span>
                <span className={index === question.correctOptionIndex ? 'text-green-500 font-medium' : ''}>
                  {option}
                </span>
                {index === question.correctOptionIndex && (
                  <span className="text-green-500 text-sm">(الإجابة الصحيحة)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
