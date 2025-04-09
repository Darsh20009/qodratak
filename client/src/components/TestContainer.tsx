import { Question } from '../lib/types';
import QuestionContainer from './QuestionContainer';

interface TestContainerProps {
  title: string;
  description: string;
  timeRemaining: string;
  progress: {
    current: number;
    total: number;
    percent: number;
  };
  section: string;
  question: Question;
  selectedAnswer: number | null;
  showDebug: boolean;
  debugInfo: {
    questionId: number;
    questionsLoaded: number;
    currentIndex: number;
    source: string;
    timeRemaining: string;
  };
  onNext: () => void;
  onPrev: () => void;
  onSelectAnswer: (index: number) => void;
  onFinish?: () => void; // زر إنهاء الاختبار اختياري
}

const TestContainer: React.FC<TestContainerProps> = ({
  title,
  description,
  timeRemaining,
  progress,
  section,
  question,
  selectedAnswer,
  showDebug,
  debugInfo,
  onNext,
  onPrev,
  onSelectAnswer,
  onFinish
}) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <div className="border-b border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-700">{description}</p>
          </div>
          <div className="text-lg font-bold text-red-500">{timeRemaining}</div>
        </div>
        
        <div className="flex items-center">
          <span className="ml-2 text-gray-700 text-sm">السؤال {progress.current} من {progress.total}</span>
          <div className="h-2 bg-gray-300 rounded-full flex-grow relative">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-2 px-4 rounded-md mb-6 text-center">
        <span>{section}</span>
      </div>
      
      <QuestionContainer 
        question={question}
        selectedAnswer={selectedAnswer}
        showDebug={showDebug}
        debugInfo={debugInfo}
        onSelectAnswer={onSelectAnswer}
      />
      
      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <button 
            onClick={onPrev}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition"
            disabled={progress.current === 1}
          >
            <i className="fas fa-arrow-right ml-1"></i> السابق
          </button>
          
          {onFinish && (
            <button 
              onClick={onFinish}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
            >
              إنهاء الاختبار
            </button>
          )}
        </div>
        
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {progress.current === progress.total ? 'إنهاء الاختبار' : 'التالي'} <i className="fas fa-arrow-left mr-1"></i>
        </button>
      </div>
    </div>
  );
};

export default TestContainer;
