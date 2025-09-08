import React from 'react'
import '../styles/QuizView.css'

export default function QuizView({ quiz }) {
  if (!quiz || !Array.isArray(quiz)) {
    return <p className="muted-text">No quiz available yet.</p>
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
                  <label className="option-label">
                    <input type="radio" name={`q-${idx}`} />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <textarea className="quiz-textarea" placeholder="Your answer..." />
          )}

          <div className="quiz-divider" />
          <div className="quiz-answer">
            <span className="italic">Answer: </span>
            <span>{q.answer}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
