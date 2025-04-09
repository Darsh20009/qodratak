import { useState, useEffect } from 'react';
import { User, Question, TestConfig, TestSession } from '../lib/types';
import { QuestionStore } from '../lib/questionStore';
import TestContainer from '../components/TestContainer';
import TestResults from '../components/TestResults';

interface TestPageProps {
  user: User;
  onFinish: () => void;
}

const TestPage: React.FC<TestPageProps> = ({ user, onFinish }) => {
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  // Load test configuration and questions
  useEffect(() => {
    const configData = localStorage.getItem('qudratak_test_config');
    
    if (!configData) {
      onFinish();
      return;
    }
    
    try {
      const parsedConfig = JSON.parse(configData) as TestConfig;
      setConfig(parsedConfig);
      
      // Load questions based on config
      let allQuestions: Question[] = [];
      
      if (parsedConfig.type === 'qiyas' && parsedConfig.sections) {
        // لاختبار القياس، نعد الأسئلة حسب الأقسام
        let verbalQuestionPosition = 0;
        let quantitativeQuestionPosition = 0;
        
        // نجمع الأسئلة من كل قسم بالترتيب
        for (const section of parsedConfig.sections) {
          if (section.type === 'verbal') {
            const questions = QuestionStore.getByType('verbal')
              .slice(verbalQuestionPosition, verbalQuestionPosition + section.questionsCount);
            allQuestions = [...allQuestions, ...questions];
            verbalQuestionPosition += section.questionsCount;
          } else {
            const questions = QuestionStore.getByType('quantitative')
              .slice(quantitativeQuestionPosition, quantitativeQuestionPosition + section.questionsCount);
            allQuestions = [...allQuestions, ...questions];
            quantitativeQuestionPosition += section.questionsCount;
          }
        }
      } else {
        // للاختبارات العادية
        const verbalQuestions = parsedConfig.verbalQuestions > 0 
          ? QuestionStore.getByType('verbal').slice(0, parsedConfig.verbalQuestions)
          : [];
          
        const quantitativeQuestions = parsedConfig.quantitativeQuestions > 0
          ? QuestionStore.getByType('quantitative').slice(0, parsedConfig.quantitativeQuestions)
          : [];
        
        // Combine questions
        allQuestions = [...verbalQuestions, ...quantitativeQuestions];
      }
      
      if (allQuestions.length === 0) {
        alert('لا توجد أسئلة كافية للاختبار');
        onFinish();
        return;
      }
      
      // Create test session
      const now = new Date();
      const endTime = new Date(now.getTime() + parsedConfig.duration * 60 * 1000);
      
      const session: TestSession = {
        questions: allQuestions,
        currentQuestionIndex: 0,
        startTime: now,
        endTime: endTime,
        userAnswers: Array(allQuestions.length).fill(null)
      };
      
      setTestSession(session);
      setTimeRemaining(parsedConfig.duration * 60);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing test:', error);
      alert('حدث خطأ أثناء تحميل الاختبار');
      onFinish();
    }
  }, [onFinish]);

  // Timer effect
  useEffect(() => {
    if (!testSession || timeRemaining <= 0 || testComplete) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTestComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testSession, timeRemaining, testComplete]);

  const handleNextQuestion = () => {
    if (!testSession) return;
    
    if (testSession.currentQuestionIndex < testSession.questions.length - 1) {
      setTestSession({
        ...testSession,
        currentQuestionIndex: testSession.currentQuestionIndex + 1
      });
    } else {
      setTestComplete(true);
    }
  };

  const handlePrevQuestion = () => {
    if (!testSession || testSession.currentQuestionIndex === 0) return;
    
    setTestSession({
      ...testSession,
      currentQuestionIndex: testSession.currentQuestionIndex - 1
    });
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!testSession) return;
    
    const newAnswers = [...testSession.userAnswers];
    newAnswers[testSession.currentQuestionIndex] = optionIndex;
    
    setTestSession({
      ...testSession,
      userAnswers: newAnswers
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <div className="text-xl">جاري تحميل الاختبار...</div>
      </div>
    );
  }

  if (!testSession || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <div className="text-xl">حدث خطأ أثناء تحميل الاختبار</div>
      </div>
    );
  }

  const currentQuestion = testSession.questions[testSession.currentQuestionIndex];
  const currentAnswer = testSession.userAnswers[testSession.currentQuestionIndex];
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progressPercent = ((testSession.currentQuestionIndex + 1) / testSession.questions.length) * 100;
  
  const debugInfo = {
    questionId: currentQuestion.id,
    questionsLoaded: testSession.questions.length,
    currentIndex: testSession.currentQuestionIndex,
    source: 'localStorage',
    timeRemaining: formatTime(timeRemaining)
  };

  if (testComplete) {
    // Calculate test results
    const totalQuestions = testSession.questions.length;
    const answeredQuestions = testSession.userAnswers.filter(a => a !== null).length;
    let correctAnswers = 0;
    
    // Count correct answers
    for (let i = 0; i < testSession.userAnswers.length; i++) {
      const answer = testSession.userAnswers[i];
      if (answer !== null && answer === testSession.questions[i].correctOptionIndex) {
        correctAnswers++;
      }
    }
    
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercent >= 60; // Pass threshold 60%
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-200">
        <TestResults
          questions={testSession.questions}
          userAnswers={testSession.userAnswers}
          correctCount={correctAnswers}
          totalCount={totalQuestions}
          scorePercent={scorePercent}
          passed={passed}
          onFinish={onFinish}
        />
      </div>
    );
  }

  // تحديد نوع الاختبار والقسم الحالي
  let sectionNumber = 1;
  let sectionText = `القسم ${currentQuestion.type === 'verbal' ? 'اللفظي' : 'الكمي'}`;
  let testTitle = "اختبار القدرات";
  
  if (config.type === 'qiyas' && config.sections) {
    // في حالة اختبار القياس، نحتاج لتحديد رقم القسم الحالي
    let questionCount = 0;
    for (let i = 0; i < config.sections.length; i++) {
      const section = config.sections[i];
      questionCount += section.questionsCount;
      
      if (testSession.currentQuestionIndex < questionCount) {
        sectionNumber = i + 1;
        sectionText = `القسم ${sectionNumber}: ${section.type === 'verbal' ? 'لفظي' : 'كمي'}`;
        break;
      }
    }
    testTitle = "اختبار قياس";
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-200">
      <TestContainer
        title={`${testTitle}: ${currentQuestion.type === 'verbal' ? 'الجزء اللفظي' : 'الجزء الكمي'}`}
        description={currentQuestion.type === 'verbal' ? 'اختبار مهارات الفهم اللفظي والتحليل اللغوي' : 'قياس قدراتك في التعامل مع الأرقام والرياضيات'}
        timeRemaining={formatTime(timeRemaining)}
        progress={{
          current: testSession.currentQuestionIndex + 1,
          total: testSession.questions.length,
          percent: progressPercent
        }}
        section={sectionText}
        question={currentQuestion}
        selectedAnswer={currentAnswer}
        showDebug={false}
        debugInfo={debugInfo}
        onNext={handleNextQuestion}
        onPrev={handlePrevQuestion}
        onSelectAnswer={handleAnswerSelect}
        onFinish={() => setTestComplete(true)} // إضافة زر لإنهاء الاختبار فوراً
      />
    </div>
  );
};

export default TestPage;
