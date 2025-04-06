import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { auth } from './config/firebase';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import TemplatesBrowser from './pages/TemplatesBrowser';
import GeneratorPage from './pages/GeneratorPage';
import ProfilePage from './pages/ProfilePage';

const AppContent = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Store selectedTemplate in sessionStorage to maintain state during navigation
  useEffect(() => {
    // Attempt to load template from sessionStorage on initial load
    const savedTemplate = sessionStorage.getItem('selectedTemplate');
    if (savedTemplate && !selectedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(savedTemplate));
      } catch (e) {
        console.error('Error parsing saved template:', e);
        sessionStorage.removeItem('selectedTemplate');
      }
    }
  }, []);

  // Save template to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedTemplate) {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
    }
  }, [selectedTemplate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showAuthModal = (isRegistration = false) => {
    setIsRegister(isRegistration);
    setShowAuth(true);
  };

  const handleSelectTemplate = (template) => {
    if (user) {
      setSelectedTemplate(template);
      navigate('/generator');
    } else {
      showAuthModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        user={user}
        showAuthModal={showAuthModal}
      />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        isRegister={isRegister}
      />

      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                showAuthModal={showAuthModal}
                user={user}
              />
            } 
          />
          <Route 
            path="/templates" 
            element={
              <ProtectedRoute user={user} showAuthModal={showAuthModal}>
                <TemplatesBrowser onSelectTemplate={handleSelectTemplate} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generator" 
            element={
              <ProtectedRoute user={user} showAuthModal={showAuthModal}>
                {selectedTemplate ? (
                  <GeneratorPage 
                    template={selectedTemplate}
                    onBack={() => navigate('/templates')}
                  />
                ) : (
                  <Navigate to="/templates" />
                )}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user} showAuthModal={showAuthModal}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 LaTeXify AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;