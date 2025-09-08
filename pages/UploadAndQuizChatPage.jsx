import React, { useState } from 'react'
import FileUpload from '../components/FileUpload.jsx'
import QuizView from '../components/QuizView.jsx'
import ChatBot from '../components/ChatBot.jsx'
import axios from 'axios'
import '../styles/UploadAndQuizChatPage.css'

export default function UploadAndQuizChatPage() {
  const [uploaded, setUploaded] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateQuiz = async () => {
    if (!uploaded?.id) return
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(
        'https://hackathon-backend-dw5w.onrender.com/api/generate-quiz/',
        { uploaded_file_id: uploaded.id }
      )
      setQuiz(data.quiz)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Quiz generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Study Assistant</h1>

      {/* File Upload Section */}
      <FileUpload onUploaded={setUploaded} />

      {/* After file upload */}
      {uploaded && (
        <>
          <div className="uploaded-info-card">
            <p className="file-info">
              Uploaded File: <span className="file-name">{uploaded.original_name}</span> (ID: {uploaded.id})
            </p>
            <button onClick={generateQuiz} disabled={loading} className="btn">
              {loading ? 'Generating…' : 'Generate Quiz'}
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>

          {/* Two-column layout: Quiz | Chatbot */}
          <div className="two-column">
            <div className="left-column">
              {quiz ? <QuizView quiz={quiz} /> : <p className="muted-text">Click "Generate Quiz" to see questions</p>}
            </div>
            <div className="right-column">
              <ChatBot uploadedFileId={uploaded.id} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
