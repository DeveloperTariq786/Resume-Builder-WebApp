import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import TemplatesBrowser from './pages/TemplatesBrowser';
import GeneratorPage from './pages/GeneratorPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navigateToTemplates = () => {
    if (user) {
      setCurrentPage('templates');
    } else {
      setShowAuth(true);
      setIsRegister(true);
    }
  };

  const handleSelectTemplate = (template) => {
    if (user) {
      setSelectedTemplate(template);
      setCurrentPage('generator');
    } else {
      setShowAuth(true);
      setIsRegister(true);
    }
  };

  const handleBackToTemplates = () => {
    setCurrentPage('templates');
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        setShowAuth={setShowAuth}
        setIsRegister={setIsRegister}
      />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        isRegister={isRegister}
      />

      <main>
        {currentPage === 'landing' && (
          <LandingPage 
            onStartCreating={navigateToTemplates}
            setShowAuth={setShowAuth}
            setIsRegister={setIsRegister}
            user={user}
          />
        )}
        {currentPage === 'templates' && (
          <ProtectedRoute user={user} setShowAuth={setShowAuth} setIsRegister={setIsRegister}>
            <TemplatesBrowser onSelectTemplate={handleSelectTemplate} />
          </ProtectedRoute>
        )}
        {currentPage === 'generator' && (
          <ProtectedRoute user={user} setShowAuth={setShowAuth} setIsRegister={setIsRegister}>
            <GeneratorPage 
              template={selectedTemplate} 
              onBack={handleBackToTemplates}
            />
          </ProtectedRoute>
        )}
      </main>

      <footer className="bg-white border-t">
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

export default App;