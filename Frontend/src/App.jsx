import { useState } from 'react'
import { Sidebar } from './src/components/Sidebar'
import { TopBar } from './src/components/Header'
import AuthorManagement from './src/pages/AuthorManagement'
import BookManagement from './src/pages/BookManagement'
import BorrowManagement from './src/pages/BorrowManagement'
import Dashboard from './src/components/Dashboard'
import Statistics from './src/components/Statistics'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <TopBar currentPage={currentPage} />
      
      <main className="pl-64 pt-16">
        {currentPage === 'authors' ? (
          <AuthorManagement />
        ) : currentPage === 'books' ? (
          <BookManagement />
        ) : currentPage === 'borrowings' ? (
          <BorrowManagement />
        ) : currentPage === 'dashboard' ? (
          <Dashboard />
        ) : currentPage === 'statistics' ? (
          <Statistics />
        ) : (
          <div className="p-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold tracking-tight capitalize">
                {currentPage} Content
              </h2>
              <p className="text-muted-foreground mt-2">
                This is the placeholder content for the {currentPage} page.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
