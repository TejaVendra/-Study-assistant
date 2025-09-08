import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './ModernChatBot.css'

export default function ModernChatBot({ uploadedFileId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const send = async () => {
    if (!input.trim() || !uploadedFileId) return
    const userMsg = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('https://hackathon-backend-dw5w.onrender.com/api/chat/', {
        uploaded_file_id: uploadedFileId,
        question: userMsg.content
      })
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error getting answer.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chatbot-card">
      <h2 className="chatbot-title">Chatbot</h2>

      <div className="chat-container">
        {messages.length === 0 && (
          <p className="chat-placeholder">Ask a question about the uploaded material…</p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-message ${m.role === 'user' ? 'user-msg' : 'assistant-msg'}`}
          >
            {m.content}
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={uploadedFileId ? 'Type your question…' : 'Upload a file first'}
          disabled={!uploadedFileId || loading}
        />
        <button
          className="chat-send-btn"
          onClick={send}
          disabled={!uploadedFileId || loading}
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
