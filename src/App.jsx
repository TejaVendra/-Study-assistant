
import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import UploadPage from '../pages/UploadPage.jsx'
import QuizPage from '../pages/QuizPage.jsx'
import ChatbotPage from '../pages/ChatbotPage.jsx'
import UploadAndQuizChatPage from '../pages/UploadAndQuizChatPage.jsx'
import UploadAndChatInteractivePage from '../pages/UploadAndChatInteractivePage.jsx'

export default function App() {
  return (
    <div className="app">
      <main className="container main">
        <Routes>
          <Route path="/" element={<UploadAndChatInteractivePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
      </main>
    </div>
  )
}