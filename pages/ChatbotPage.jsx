import React, { useState } from 'react'
import ChatBot from '../components/ChatBot.jsx'

export default function ChatbotPage() {
  const [uploadedId, setUploadedId] = useState('')
  const [activeChatId, setActiveChatId] = useState(null)

  const handleStartChat = () => {
    if (uploadedId.trim()) {
      setActiveChatId(Number(uploadedId))
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStartChat()
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">AI Chat Assistant</h1>
        <p className="page-subtitle">Chat with AI about your uploaded documents</p>
      </div>

      <div className="input-card">
        <div className="input-section">
          <label className="input-label">File ID</label>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Enter uploaded file ID to start chatting"
              value={uploadedId}
              onChange={(e) => setUploadedId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleStartChat}
              disabled={!uploadedId.trim()}
            >
              <span className="btn-icon">💬</span>
              Start Chat
            </button>
          </div>
        </div>
      </div>

      <div className="chat-container">
        {activeChatId ? (
          <ChatBot uploadedFileId={activeChatId} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <h3>Ready to Chat</h3>
            <p>Enter a file ID above to start an AI-powered conversation about your document.</p>
          </div>
        )}
      </div>
    </div>
  )
}
