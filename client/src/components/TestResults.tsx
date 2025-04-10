import { useState } from 'react';
import { Question } from '../lib/types';

interface TestResultsProps {
  questions: Question[];
  userAnswers: (number | null)[];
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  passed: boolean;
  onFinish: () => void;
  onRetry: () => void;
  onNextTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  questions,
  userAnswers,
  correctCount,
  totalCount,
  scorePercent,
  passed,
  onFinish,
  onRetry,
  onNextTest
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const toggleShowErrors = () => {
    setShowErrors(prev => !prev);
    if (showAllQuestions && !showErrors) {
      setShowAllQuestions(false);
    }
  };

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(prev => !prev);
    if (showErrors && !showAllQuestions) {
      setShowErrors(false);
    }
  };

  // تحضير قائمة الأسئلة التي سيتم عرضها
  const questionsToShow = questions.filter((question, index) => {
    // إذا كان "عرض جميع الأسئلة" مفعل، عرض كل الأسئلة
    if (showAllQuestions) return true;

    // إذا كان "عرض الأخطاء" مفعل، عرض الأسئلة التي أخطأ فيها فقط
    if (showErrors) {
      const isIncorrect = userAnswers[index] !== question.correctOptionIndex;
      return isIncorrect;
    }

    // إذا لم يتم تفعيل أي من الخيارين، عرض الأسئلة الصحيحة فقط
    return false;
  });

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <div className={`p-6 rounded-lg ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
        <h2 className="text-2xl font-bold text-center mb-4">نتائج الاختبار</h2>

        <div className="text-center text-6xl my-5">
          {passed ? '🎉' : '😕'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-700 mb-2">الأسئلة الكلية</h3>
            <div className="text-2xl font-bold">{totalCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-700 mb-2">الإجابات الصحيحة</h3>
            <div className="text-2xl font-bold">{correctCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h3 className="text-gray-700 mb-2">النسبة المئوية</h3>
            <div className="text-2xl font-bold">{scorePercent}%</div>
          </div>
        </div>

        {passed ? (
          <div className="text-center text-green-600 text-xl font-bold my-4">
            مبروك! لقد اجتزت الاختبار بنجاح
          </div>
        ) : (
          <div className="text-center text-red-600 text-xl font-bold my-4">
            للأسف، لم تتمكن من اجتياز الاختبار. يمكنك المحاولة مرة أخرى.
          </div>
        )}

        {/* خيارات عرض الأسئلة */}
        <div className="mt-8 mb-6 flex flex-wrap justify-center gap-3">
          <button 
            onClick={toggleShowErrors}
            className={`px-4 py-2 rounded-md font-medium transition ${
              showErrors 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-red-500 border border-red-500'
            }`}
          >
            عرض الأخطاء ({totalCount - correctCount})
          </button>

          <button 
            onClick={toggleShowAllQuestions}
            className={`px-4 py-2 rounded-md font-medium transition ${
              showAllQuestions 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            عرض جميع الأسئلة ({totalCount})
          </button>
        </div>

        {/* عرض الأسئلة */}
        {(showErrors || showAllQuestions) && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-bold mb-4">
              {showErrors ? 'الأسئلة التي أخطأت فيها' : 'جميع أسئلة الاختبار'}
            </h3>

            {questionsToShow.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {showErrors ? 'لم تخطئ في أي سؤال. أحسنت!' : 'لا توجد أسئلة لعرضها.'}
              </div>
            ) : (
              <div className="space-y-8">
                {questionsToShow.map((question, qIndex) => {
                  const originalIndex = questions.findIndex(q => q.id === question.id);
                  const userAnswer = userAnswers[originalIndex];
                  const isCorrect = userAnswer === question.correctOptionIndex;

                  return (
                    <div 
                      key={`result-${question.id}`} 
                      className={`p-4 rounded-lg ${
                        isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          سؤال {originalIndex + 1} من {totalCount}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                        </span>
                      </div>

                      <div className="font-medium text-lg mb-4">{question.text}</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option, optIndex) => (
                          <div 
                            key={`q${question.id}-opt${optIndex}`}
                            className={`p-3 rounded-md flex items-start gap-2 ${
                              optIndex === question.correctOptionIndex
                                ? 'bg-green-100 border border-green-300'
                                : userAnswer === optIndex
                                  ? 'bg-red-100 border border-red-300'
                                  : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="font-medium ml-2">
                              {['أ', 'ب', 'ج', 'د'][optIndex]}.
                            </div>
                            <div className="flex-grow">{option}</div>
                            {optIndex === question.correctOptionIndex && (
                              <div className="flex-shrink-0 text-green-600">✓</div>
                            )}
                            {userAnswer === optIndex && userAnswer !== question.correctOptionIndex && (
                              <div className="flex-shrink-0 text-red-600">✗</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          {passed ? (
            <button 
              onClick={onNextTest}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition font-medium"
            >
              الاختبار التالي
            </button>
          ) : (
            <button 
              onClick={onRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition font-medium"
            >
              إعادة الاختبار
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResults;