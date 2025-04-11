import { useState } from 'react';
import { useLocation } from 'wouter';
import { User, TestConfig } from '../lib/types';
import DashboardHeader from '../components/DashboardHeader';
import TestOptions from '../components/TestOptions';
import CustomTestSetup from '../components/CustomTestSetup';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [showCustomSetup, setShowCustomSetup] = useState(false);
  const [, setLocation] = useLocation();

  const handleStartTest = (testType: 'verbal' | 'quantitative') => {
    // Save test configuration to localStorage
    const config: TestConfig = {
      type: 'standard',
      verbalQuestions: testType === 'verbal' ? 20 : 0,
      quantitativeQuestions: testType === 'quantitative' ? 20 : 0,
      duration: 30 // 30 minutes default
    };
    
    localStorage.setItem('qudratak_test_config', JSON.stringify(config));
    setLocation('/test');
  };
  
  const handleStartQiyasTest = () => {
    // القياس اختبار بتنسيق 7 أقسام (120 سؤال في 120 دقيقة)
    // القسم الأول: 13 لفظي و 11 كمي (24 سؤال في 24 دقيقة)
    // القسم الثاني: 13 لفظي و 11 كمي (24 سؤال في 24 دقيقة)
    // القسم الثالث: 13 لفظي و 11 كمي (24 سؤال في 24 دقيقة)
    // القسم الرابع: 13 لفظي (13 سؤال في 13 دقيقة)
    // القسم الخامس: 11 كمي (11 سؤال في 11 دقيقة)
    // القسم السادس: 13 لفظي (13 سؤال في 13 دقيقة)
    // القسم السابع: 11 كمي (11 سؤال في 11 دقيقة)
    
    const qiyasConfig: TestConfig = {
      type: 'qiyas',
      verbalQuestions: 65, // إجمالي الأسئلة اللفظية
      quantitativeQuestions: 55, // إجمالي الأسئلة الكمية
      duration: 120, // مدة الاختبار بالدقائق
      sections: [
        { id: 1, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 2, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 3, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 4, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 5, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 6, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 7, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 8, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 9, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 10, type: 'quantitative', questionsCount: 11, duration: 11 }
      ]
    };ion: 13 },
        { id: 4, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 5, type: 'verbal', questionsCount: 13, duration: 13 },
        { id: 6, type: 'quantitative', questionsCount: 11, duration: 11 },
        { id: 7, type: 'verbal', questionsCount: 13, duration: 13 }
      ]
    };
    
    localStorage.setItem('qudratak_test_config', JSON.stringify(qiyasConfig));
    setLocation('/test');
  };

  const handleStartCustomTest = (config: TestConfig) => {
    // Save test configuration to localStorage
    localStorage.setItem('qudratak_test_config', JSON.stringify(config));
    setShowCustomSetup(false);
    setLocation('/test');
  };

  return (
    <div className="min-h-screen p-4 bg-neutral-200">
      <DashboardHeader 
        title="لوحة التحكم"
        user={user}
        onLogout={onLogout}
      />
      
      <TestOptions 
        onStartTest={handleStartTest}
        onCreateCustomTest={() => setShowCustomSetup(true)}
        onStartQiyasTest={handleStartQiyasTest}
      />
      
      {showCustomSetup && (
        <CustomTestSetup 
          onStart={handleStartCustomTest}
          onCancel={() => setShowCustomSetup(false)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
