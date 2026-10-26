import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './api/client';
import { LanguageProvider } from './context/LanguageContext';
import { HistoryProvider } from './context/HistoryContext';
import { UserProvider } from './context/UserContext';
import { ConditionProvider } from './context/ConditionContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TaskSelectionPage from './pages/TaskSelectionPage';
import ScanCenterPage from './pages/ScanCenterPage';
import ResultsPage from './pages/ResultsPage';
import EvaluationPage from './pages/EvaluationPage';
import DatasetExplorerPage from './pages/DatasetExplorerPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ConditionCatalogPage from './pages/ConditionCatalogPage';
import ModelCoveragePage from './pages/ModelCoveragePage';
import BrainAnatomyPage from './pages/BrainAnatomyPage';
import MriSequenceComparePage from './pages/MriSequenceComparePage';
import VivaPresentationPage from './pages/VivaPresentationPage';
import VoiceNavigator from './components/accessibility/VoiceNavigator';

// Student Learning Module Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import LearnMriFeaturesPage from './pages/student/LearnMriFeaturesPage';
import VisualCnnJourneyPage from './pages/student/VisualCnnJourneyPage';
import BrainTumorLearningPage from './pages/student/BrainTumorLearningPage';
import CaseLibraryPage from './pages/student/CaseLibraryPage';
import CasePracticePage from './pages/student/CasePracticePage';
import QuizzesPage from './pages/student/QuizzesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

const AppContent: React.FC = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await api.getHealth();
        setModelLoaded(health.model_loaded);
      } catch (err) {
        setModelLoaded(false);
      }
    };
    checkStatus();
  }, []);

  // For the medical login experience, render the standalone medical view
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      <Navbar modelLoaded={modelLoaded} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          <Routes>
            {/* Protected Patient & Core Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scans"
              element={
                <ProtectedRoute>
                  <ScanCenterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <ConditionCatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/model-coverage"
              element={
                <ProtectedRoute>
                  <ModelCoveragePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brain-anatomy"
              element={
                <ProtectedRoute allowedRole="student">
                  <BrainAnatomyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/anatomy"
              element={<Navigate to="/student/anatomy" replace />}
            />
            <Route
              path="/sequence-compare"
              element={
                <ProtectedRoute>
                  <MriSequenceComparePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute allowedRole="student">
                  <QuizzesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viva"
              element={
                <ProtectedRoute allowedRole="student">
                  <VivaPresentationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/viva"
              element={
                <ProtectedRoute allowedRole="student">
                  <VivaPresentationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluation"
              element={
                <ProtectedRoute>
                  <EvaluationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/model-performance"
              element={
                <ProtectedRoute>
                  <EvaluationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataset"
              element={
                <ProtectedRoute>
                  <DatasetExplorerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <ProtectedRoute>
                  <HowItWorksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Medical Student Learning Module Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/anatomy"
              element={
                <ProtectedRoute allowedRole="student">
                  <BrainAnatomyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/features"
              element={
                <ProtectedRoute allowedRole="student">
                  <LearnMriFeaturesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/journey"
              element={
                <ProtectedRoute allowedRole="student">
                  <VisualCnnJourneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tumors"
              element={
                <ProtectedRoute allowedRole="student">
                  <BrainTumorLearningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/cases"
              element={
                <ProtectedRoute allowedRole="student">
                  <CaseLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/cases/:caseId"
              element={
                <ProtectedRoute allowedRole="student">
                  <CasePracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/quizzes"
              element={
                <ProtectedRoute allowedRole="student">
                  <QuizzesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-800 bg-[#0a0f1d] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-200">
            AXONOVA • AI-Powered Brain MRI Intelligence & Medical Learning
          </p>
          <p className="text-[11px] text-slate-400">
            Academic & research prototype. Output scores are intended to support learning and research only.
          </p>
        </div>
      </footer>

      {/* Global Voice Navigation & Accessibility Palette */}
      <VoiceNavigator />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <UserProvider>
        <LanguageProvider>
          <HistoryProvider>
            <ConditionProvider>
              <AppContent />
            </ConditionProvider>
          </HistoryProvider>
        </LanguageProvider>
      </UserProvider>
    </HashRouter>
  );
};

export default App;
