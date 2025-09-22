import React, { useState } from 'react'
import QuizView from '../components/QuizView.jsx'
import axios from 'axios'

export default function QuizPage() {
  const [uploadedId, setUploadedId] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchQuiz = async () => {
    if (!uploadedId) return
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('https://hackathon-backend-dw5w.onrender.com/api/generate-quiz/', {
        uploaded_file_id: Number(uploadedId)
      })
      setQuiz(data.quiz)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      fetchQuiz()
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Quiz Generator</h1>
        <p className="page-subtitle">Enter a file ID to generate and take a quiz</p>
      </div>

      <div className="input-card">
        <div className="input-section">
          <label className="input-label">File ID</label>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Enter uploaded file ID (e.g., 123)"
              value={uploadedId}
              onChange={(e) => setUploadedId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn btn-primary" 
              onClick={fetchQuiz} 
              disabled={loading || !uploadedId.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔍</span>
                  Load Quiz
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="quiz-container">
        <QuizView quiz={quiz} />
      </div>
    </div>
  )
}
