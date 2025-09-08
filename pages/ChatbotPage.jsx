import React, { useState } from 'react'
import ChatBot from '../components/ChatBot.jsx'

export default function ChatbotPage() {
  const [uploadedId, setUploadedId] = useState('')

  return (
    <div className="grid" style={{ display: 'grid', gap: 16 }}>
      <div className="card">
        <h2 className="section-title">Select Uploaded File</h2>
        <input
          className="input"
          placeholder="Uploaded file id"
          value={uploadedId}
          onChange={(e) => setUploadedId(e.target.value)}
        />
      </div>
      <ChatBot uploadedFileId={uploadedId ? Number(uploadedId) : null} />
    </div>
  )
}