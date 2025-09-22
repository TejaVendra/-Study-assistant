import React, { useState, useEffect } from 'react'
import './InteractiveQuiz.css'

export default function InteractiveQuiz({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [quizMode, setQuizMode] = useState('practice') // 'practice' or 'timed'

  useEffect(() => {
    if (quizMode === 'timed' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmit()
    }
  }, [timeLeft, quizMode])

  useEffect(() => {
    if (quiz && quiz.length > 0 && quizMode === 'timed') {
      setTimeLeft(quiz.length * 60) // 1 minute per question
    }
  }, [quiz, quizMode])

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const handleSubmit = () => {
    if (!quiz) return
    
    let correctCount = 0
    quiz.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer && userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()) {
        correctCount++
      }
    })
    
    setScore(correctCount)
    setSubmitted(true)
    setShowResults(true)
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setShowResults(false)
    setCurrentQuestion(0)
    if (quizMode === 'timed' && quiz) {
      setTimeLeft(quiz.length * 60)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981'
    if (percentage >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="quiz-empty-state">
        <div className="empty-icon">📝</div>
        <h3>No Quiz Available</h3>
        <p>Please generate a quiz first to start practicing.</p>
      </div>
    )
  }

  const percentage = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0

  return (
    <div className="interactive-quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header-section">
        <div className="quiz-info">
          <h2 className="quiz-main-title">Interactive Quiz</h2>
          <p className="quiz-description">
            {quiz.length} question{quiz.length !== 1 ? 's' : ''} • 
            Test your knowledge
          </p>
        </div>
        
        <div className="quiz-controls">
          <div className="mode-selector">
            <button
              className={`mode-btn ${quizMode === 'practice' ? 'active' : ''}`}
              onClick={() => setQuizMode('practice')}
              disabled={submitted}
            >
              Practice Mode
            </button>
            <button
              className={`mode-btn ${quizMode === 'timed' ? 'active' : ''}`}
              onClick={() => setQuizMode('timed')}
              disabled={submitted}
            >
              Timed Mode
            </button>
          </div>
          
          {quizMode === 'timed' && timeLeft !== null && (
            <div className="timer">
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!showResults && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((Object.keys(answers).length) / quiz.length) * 100}%` 
              }}
            />
          </div>
          <span className="progress-text">
            {Object.keys(answers).length} of {quiz.length} answered
          </span>
        </div>
      )}

      {/* Results Summary */}
      {showResults && (
        <div className="results-summary">
          <div className="score-circle" style={{ borderColor: getScoreColor(percentage) }}>
            <span className="score-percentage" style={{ color: getScoreColor(percentage) }}>
              {percentage}%
            </span>
            <span className="score-fraction">
              {score}/{quiz.length}
            </span>
          </div>
          <div className="results-info">
            <h3 className="results-title">Quiz Complete!</h3>
            <p className="results-message">
              {percentage >= 80 ? '🎉 Excellent work!' : 
               percentage >= 60 ? '👍 Good job!' : 
               '💪 Keep practicing!'}
            </p>
            <button className="retry-btn" onClick={handleReset}>
              <span>🔄</span>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      <div className="questions-container">
        {quiz.map((question, index) => (
          <div key={index} className="question-card">
            <div className="question-header">
              <div className="question-number">Q{index + 1}</div>
              <span className="question-type-badge">
                {question.type || 'Question'}
              </span>
            </div>
            
            <h3 className="question-text">{question.question}</h3>
            
            {question.type === 'MCQ' && Array.isArray(question.options) ? (
              <div className="mcq-options">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="mcq-option">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={submitted}
                    />
                    <span className="option-text">{option}</span>
                    {submitted && option === question.answer && (
                      <span className="correct-indicator">✓</span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-answer-section">
                <textarea
                  className="answer-textarea"
                  placeholder="Type your answer here..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={submitted}
                />
              </div>
            )}
            
            {submitted && (
              <div className="answer-feedback">
                <div className="correct-answer">
                  <span className="feedback-label">Correct Answer:</span>
                  <span className="feedback-text">{question.answer}</span>
                </div>
                {answers[index] && (
                  <div className={`user-answer ${
                    answers[index].toLowerCase().trim() === question.answer.toLowerCase().trim()
                      ? 'correct' : 'incorrect'
                  }`}>
                    <span className="feedback-label">Your Answer:</span>
                    <span className="feedback-text">{answers[index]}</span>
                    <span className="feedback-icon">
                      {answers[index].toLowerCase().trim() === question.answer.toLowerCase().trim() 
                        ? '✓' : '✗'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="submit-section">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
          >
            <span>🎯</span>
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  )
}