import React, { useState } from 'react'
import FileUpload from '../components/FileUpload.jsx'
import InteractiveQuiz from './InteractiveQuiz.jsx'
import ModernChatBot from '../components/ModernChatBot.jsx'
import axios from 'axios'
import './UploadAndChatInteractivePage.css'

export default function UploadAndChatInteractivePage() {
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
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">📚 Study Assistant</div>
      </nav>

      <div className="content-wrapper">
        {/* File Upload */}
        <FileUpload onUploaded={setUploaded} />

        {/* After uploading a file */}
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

            {/* Two-column layout: Quiz | ChatBot */}
            <div className="two-column">
              <div className="left-column">
                {quiz ? <InteractiveQuiz quiz={quiz} /> : <p className="muted-text">Click "Generate Quiz" to start.</p>}
              </div>
              <div className="right-column">
                <ModernChatBot uploadedFileId={uploaded.id} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
