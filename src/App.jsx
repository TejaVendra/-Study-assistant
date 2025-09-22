import './App.css'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import QuizPage from '../pages/QuizPage.jsx'
import ChatbotPage from '../pages/ChatbotPage.jsx'
import UploadAndChatInteractivePage from '../pages/UploadAndChatInteractivePage.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <nav className="main-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">StudyMate AI</span>
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/quiz" 
              className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
            >
              Quiz
            </Link>
            <Link 
              to="/chat" 
              className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
            >
              Chat
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<UploadAndChatInteractivePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
      </main>
    </div>
  )
}
