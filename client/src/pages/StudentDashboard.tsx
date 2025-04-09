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
      verbalQuestions: testType === 'verbal' ? 20 : 0,
      quantitativeQuestions: testType === 'quantitative' ? 20 : 0,
      duration: 30 // 30 minutes default
    };
    
    localStorage.setItem('qudratak_test_config', JSON.stringify(config));
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
