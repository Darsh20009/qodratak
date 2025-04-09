import { Question } from '../lib/types';

interface QuestionContainerProps {
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
  onSelectAnswer: (index: number) => void;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer
}) => {
  return (
    <div className="question-container mb-8">
      <div className="question-text mb-6 text-lg">
        <div>
          {question.text}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <button 
            key={index}
            className={`bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md p-4 text-right transition ${selectedAnswer === index ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => onSelectAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionContainer;
