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
    const config: TestConfig = {
      type: 'standard',
      verbalQuestions: testType === 'verbal' ? 65 : 0,
      quantitativeQuestions: testType === 'quantitative' ? 55 : 0,
      duration: testType === 'verbal' ? 65 : 55
    };

    localStorage.setItem('qudratak_test_config', JSON.stringify(config));
    setLocation('/test');
  };

  const handleStartQiyasTest = () => {
    const qiyasConfig: TestConfig = {
      type: 'qiyas',
      verbalQuestions: 65,
      quantitativeQuestions: 55,
      duration: 120,
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
    };

    localStorage.setItem('qudratak_test_config', JSON.stringify(qiyasConfig));
    setLocation('/test');
  };

  const handleStartCustomTest = (config: TestConfig) => {
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