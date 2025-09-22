import React, { useState, useRef } from 'react'
import './FileUpload.css'

export default function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFile(droppedFile)) {
        setFile(droppedFile)
        setError('')
      }
    }
  }

  const isValidFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, DOCX, or TXT file')
      return false
    }
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      return false
    }
    
    return true
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile)
      setError('')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf': return '📄'
      case 'docx': return '📝'
      case 'txt': return '📃'
      default: return '📎'
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setError('')
    
    try {
      const form = new FormData()
      form.append('file', file)
      
      const response = await fetch('https://hackathon-backend-dw5w.onrender.com/api/upload/', {
        method: 'POST',
        body: form
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const data = await response.json()
      onUploaded?.(data)
      
      // Reset form on success
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={onSubmit} className="upload-card">
      <div className="upload-header">
        <h2 className="upload-title">Upload Study Material</h2>
        <p className="upload-subtitle">
          Upload PDF, DOCX, or TXT files to get started
        </p>
      </div>

      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        {!file ? (
          <>
            <div className="upload-icon">📤</div>
            <div className="upload-text">
              <p className="upload-primary-text">
                Drop your file here or <span className="upload-link">click to browse</span>
              </p>
              <p className="upload-secondary-text">
                Supports PDF, DOCX, TXT files up to 10MB
              </p>
            </div>
          </>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <span className="file-icon">{getFileIcon(file.name)}</span>
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="upload-input-hidden"
        aria-hidden="true"
      />

      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <button 
        type="submit"
        className="upload-btn" 
        disabled={!file || loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Uploading...
          </>
        ) : (
          <>
            <span className="btn-icon">🚀</span>
            Upload File
          </>
        )}
      </button>

      <div className="upload-tips">
        <h4>Tips for better results:</h4>
        <ul>
          <li>Use clear, well-formatted documents</li>
          <li>Ensure text is readable and not scanned images</li>
          <li>Smaller files process faster</li>
        </ul>
      </div>
    </form>
  )
}