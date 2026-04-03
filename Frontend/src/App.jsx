import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './src/components/Sidebar';
import { TopBar } from './src/components/Header';
import AuthorManagement from './src/pages/AuthorManagement';
import BookManagement from './src/pages/BookManagement';
import BorrowManagement from './src/pages/BorrowManagement';
import Dashboard from './src/components/Dashboard';
import Statistics from './src/components/Statistics';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-muted/20">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="md:pl-64 pt-16 transition-all duration-300">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/authors" element={<AuthorManagement />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/borrowings" element={<BorrowManagement />} />
            <Route path="/statistics" element={<Statistics />} />
            
            {/* 404 Catch-all */}
            <Route path="*" element={
              <div className="p-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold tracking-tight">404 Not Found</h2>
                  <p className="text-muted-foreground mt-2">
                    The requested page could not be located.
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;