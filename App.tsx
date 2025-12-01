import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatternViewer from './components/PatternViewer';
import StrategyBuilder from './components/StrategyBuilder';
import QuizMode from './components/QuizMode';
import AiTutor from './components/AiTutor';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);

  const renderContent = () => {
    switch (mode) {
      case AppMode.DASHBOARD:
        return <Dashboard onNavigate={setMode} />;
      case AppMode.PATTERNS:
        return <PatternViewer />;
      case AppMode.STRATEGIES:
        return <StrategyBuilder />;
      case AppMode.QUIZ:
        return <QuizMode />;
      case AppMode.TUTOR:
        return <AiTutor />;
      default:
        return <Dashboard onNavigate={setMode} />;
    }
  };

  return (
    <Layout currentMode={mode} onModeChange={setMode}>
      {renderContent()}
    </Layout>
  );
};

export default App;
