import React, { useState } from 'react'
import axios from 'axios'

export default function ChatBot({ uploadedFileId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="card">
      <h2 className="section-title">Chatbot</h2>
      <div className="chat-box" style={{ minHeight: 220 }}>
        {messages.length === 0 && (
          <p className="muted">Ask a question about the uploaded material…</p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: 8,
              background: m.role === 'user' ? '#e0f2fe' : '#f3f4f6'
            }}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
          placeholder={uploadedFileId ? 'Type your question…' : 'Upload a file first'}
          disabled={!uploadedFileId || loading}
        />
        <button className="btn" onClick={send} disabled={!uploadedFileId || loading}>
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
