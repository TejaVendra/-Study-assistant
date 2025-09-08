import React, { useState } from 'react'
import './InteractiveQuiz.css'

export default function InteractiveQuiz({ quiz }) {
  const [answers, setAnswers] = useState({}) // {questionIndex: selectedOptionIndex}
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  if (!quiz || !Array.isArray(quiz)) return <p className="muted-text">No quiz available yet.</p>

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    let s = 0
    quiz.forEach((q, idx) => {
      if (q.type === 'MCQ' && answers[idx] !== undefined) {
        if (q.options[answers[idx]] === q.answer) s++
      }
    })
    setScore(s)
    setSubmitted(true)
  }

  return (
    <div className="quiz-grid">
      {quiz.map((q, idx) => (
        <div key={idx} className="quiz-card">
          <div className="quiz-header">
            <p className="quiz-question">{q.question}</p>
            <span className="quiz-badge">{q.type || 'Question'}</span>
          </div>

          {q.type === 'MCQ' && Array.isArray(q.options) ? (
            <ul className="quiz-options">
              {q.options.map((opt, i) => (
                <li key={i}>
                  <button
                    className={`option-btn ${answers[idx] === i ? 'selected' : ''} ${
                      submitted
                        ? opt === q.answer
                          ? 'correct'
                          : answers[idx] === i
                          ? 'wrong'
                          : ''
                        : ''
                    }`}
                    onClick={() => handleSelect(idx, i)}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <textarea
              className="quiz-textarea"
              placeholder="Your answer..."
              value={answers[idx] || ''}
              onChange={(e) => handleSelect(idx, e.target.value)}
              disabled={submitted}
            />
          )}
        </div>
      ))}

      {!submitted && (
        <button className="btn-submit" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {submitted && (
        <div className="quiz-score">
          Your Score: {score} / {quiz.length}
        </div>
      )}
    </div>
  )
}
