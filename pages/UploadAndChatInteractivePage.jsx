
// UploadAndChatInteractivePage.jsx
import React, { useState } from 'react'
import FileUpload from '../components/FileUpload.jsx'
import InteractiveQuiz from './InteractiveQuiz.jsx'
import ModernChatBot from '../components/ModernChatBot.jsx'
import axios from 'axios'
import '../styles/UploadAndChatInteractivePage.css'

export default function UploadAndChatInteractivePage() {
  const [uploaded, setUploaded] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('upload')

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
      setActiveTab('quiz')
    } catch (e) {
      setError(e?.response?.data?.detail || 'Quiz generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Interactive Study Dashboard</h1>
        <p className="dashboard-subtitle">Upload your documents and start learning with AI-powered tools</p>
      </div>

      <div className="upload-section">
        <FileUpload onUploaded={setUploaded} />
      </div>

      {uploaded && (
        <>
          <div className="file-status-card">
            <div className="status-info">
              <div className="status-icon">✅</div>
              <div className="status-details">
                <h3 className="status-title">File Uploaded Successfully</h3>
                <p className="status-text">
                  <strong>{uploaded.original_name}</strong>
                  <span className="file-id">ID: {uploaded.id}</span>
                </p>
              </div>
            </div>
            <div className="status-actions">
              <button 
                onClick={generateQuiz} 
                disabled={loading} 
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🧠</span>
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
            </div>
          )}

          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
                disabled={!quiz}
              >
                <span className="tab-icon">📝</span>
                Interactive Quiz
              </button>
              <button 
                className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <span className="tab-icon">💬</span>
                AI Chat Assistant
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'quiz' && (
                <div className="quiz-panel">
                  {quiz ? (
                    <InteractiveQuiz quiz={quiz} />
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h3>No Quiz Generated Yet</h3>
                      <p>Click "Generate Quiz" above to create an interactive quiz from your uploaded document.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className="chat-panel">
                  <ModernChatBot uploadedFileId={uploaded.id} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}