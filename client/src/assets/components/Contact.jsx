import React, { useState } from 'react'
import './ContactUs.css'
import axios from 'axios'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email || !message) return setError('Please provide your email and a message.')
    setSending(true)
    try {
      const { data } = await axios.post('/api/contact', { name, email, subject, message })
      setSuccess(data?.message || 'Message sent successfully')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-modern-layout">
      <div className="contact-grid">
        {/* Left Side: Info */}
        <div className="contact-info-panel">
          <div className="contact-header">
            <span className="contact-badge">Contact Us</span>
            <h1>Let's Start a <br/><span className="gradient-text">Conversation</span></h1>
            <p>Whether you're an enterprise looking for compliance solutions or an individual seeking legal guidance, our team is ready to assist you.</p>
          </div>

          <div className="info-cards-wrapper">
            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+1800 001 1582</p>
                <p>+91 8213151301</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h4>Email Support</h4>
                <p>jurisai@proton.me</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h4>Headquarters</h4>
                <p>VIT Chennai, Vandalur-Kelambakkam Road</p>
                <p>Chennai, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-panel">
          <div className="form-glass-container">
            <h2>Send a Message</h2>
            <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@company.com" required />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" placeholder="How can we help?" />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide details about your inquiry..." rows="5" required></textarea>
              </div>
              
              <button type="submit" className="submit-btn" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {success && <div className="contact-alert success" role="status">{success}</div>}
            {error && <div className="contact-alert error" role="alert">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
