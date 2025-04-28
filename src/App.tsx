import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import FeedbackForms from './pages/FeedbackForms';
import CreateForm from './pages/CreateForm';
import ViewForm from './pages/ViewForm';
import Analytics from './pages/Analytics';
import ActionItems from './pages/ActionItems';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Handle navigation
  const handleNavigation = (view: string) => {
    setActiveView(view);
    setSelectedFormId(null);
  };

  // Handle form creation success
  const handleFormCreated = (formId: string) => {
    setSelectedFormId(formId);
    setActiveView('viewForm');
  };

  // Render login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-blue-600">
              FacultyFeedback
            </h1>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  defaultValue="siddharth.bhatt@university.edu"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  defaultValue="password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render main app content
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar 
          onItemClick={handleNavigation} 
          activeItem={activeView}
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && <Dashboard />}
            
            {activeView === 'forms' && (
              <FeedbackForms
                onCreateForm={() => setActiveView('createForm')}
                onViewFormDetails={(formId) => {
                  setSelectedFormId(formId);
                  setActiveView('viewForm');
                }}
              />
            )}
            
            {activeView === 'createForm' && (
              <CreateForm
                onBack={() => setActiveView('forms')}
                onCreateSuccess={handleFormCreated}
              />
            )}
            
            {activeView === 'viewForm' && selectedFormId && (
              <ViewForm
                formId={selectedFormId}
                onBack={() => setActiveView('forms')}
              />
            )}

            {activeView === 'analytics' && <Analytics />}
            
            {activeView === 'actions' && <ActionItems />}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <AppContent />
      </FeedbackProvider>
    </AuthProvider>
  );
};

export default App;