import React, { useState } from 'react'
import FileUpload from '../components/FileUpload.jsx'
import QuizView from '../components/QuizView.jsx'
import axios from 'axios'
import '../styles/FileUpload.css'

export default function UploadPage() {
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
      setQuiz(data.quiz) // Expecting an array of {question, options, type, answer}
    } catch (e) {
      setError(e?.response?.data?.detail || 'Quiz generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">AI Quiz Generator</h1>

      <div className="content-container">
        {/* File Upload */}
        <FileUpload onUploaded={setUploaded} />

        {/* Uploaded File Card */}
        {uploaded && (
          <div className="card">
            <p className="file-info">
              Uploaded File: <span className="file-name">{uploaded.original_name}</span> (ID: {uploaded.id})
            </p>
            <button onClick={generateQuiz} disabled={loading} className="btn">
              {loading ? 'Generating…' : 'Generate Quiz'}
            </button>
            {error && <p className="error-text">{error}</p>}
          </div>
        )}

        {/* Quiz Display */}
        {quiz && <QuizView quiz={quiz} />}
      </div>
    </div>
  )
}
