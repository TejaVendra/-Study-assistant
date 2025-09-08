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

  return (
    <div className="grid" style={{ display: 'grid', gap: 16 }}>
      <div className="card">
        <h2 className="section-title">Load Quiz</h2>
        <div className="row">
          <input
            className="input"
            placeholder="Uploaded file id"
            value={uploadedId}
            onChange={(e) => setUploadedId(e.target.value)}
          />
          <button className="btn" onClick={fetchQuiz} disabled={loading}>
            {loading ? 'Loading…' : 'Load Quiz'}
          </button>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</p>}
      </div>
      <QuizView quiz={quiz} />
    </div>
  )
}