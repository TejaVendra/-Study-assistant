import React, { useState } from 'react'
import axios from 'axios'

export default function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await axios.post('https://hackathon-backend-dw5w.onrender.com/api/upload/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onUploaded?.(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ maxWidth: 520 }}>
      <h2 className="section-title">Upload Study Material</h2>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="input"
      />
      <div style={{ height: 12 }} />
      <button className="btn" disabled={!file || loading}>
        {loading ? 'Uploading…' : 'Upload'}
      </button>
      {error && <p style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</p>}
    </form>
  )
}