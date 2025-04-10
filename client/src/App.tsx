import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminPanel from "@/pages/AdminPanel";
import TestPage from "@/pages/TestPage";
import StudyPage from "@/pages/StudyPage";
import { User, ActiveView } from "./lib/types";
import { QuestionStore } from "./lib/questionStore";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('login');
  const [, setLocation] = useLocation();

  // Check for logged in user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('qudratak_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        
        // Redirect based on user type
        if (parsedUser.isAdmin) {
          setActiveView('adminPanel');
          setLocation('/admin');
        } else {
          setActiveView('studentDashboard');
          setLocation('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('qudratak_user');
      }
    }
    
    // Initialize sample questions for development if none exist
    QuestionStore.injectSampleQuestions();
  }, [setLocation]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('qudratak_user', JSON.stringify(loggedInUser));
    
    if (loggedInUser.isAdmin) {
      setActiveView('adminPanel');
      setLocation('/admin');
    } else {
      setActiveView('studentDashboard');
      setLocation('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('qudratak_user');
    setActiveView('login');
    setLocation('/');
  };

  return (
    <Switch>
      <Route path="/">
        <Login onLogin={handleLogin} />
      </Route>
      <Route path="/dashboard">
        {user && !user.isAdmin ? (
          <StudentDashboard user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Route>
      <Route path="/admin">
        {user && user.isAdmin ? (
          <AdminPanel user={user} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Route>
      <Route path="/test">
        {user ? (
          <TestPage user={user} onFinish={() => setLocation('/dashboard')} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
