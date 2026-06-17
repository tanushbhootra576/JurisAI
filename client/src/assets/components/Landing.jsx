import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import SplineScene from './SplineScene';

const Landing = () => {
  return (
    <div className="landing-modern-wrapper">
      {/* Dynamic Hero */}
      <section className="landing-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="landing-hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">Welcome to the Future of Law</div>
          <h1>Navigate Indian Law <br /> With <span className="gradient-text">Confidence</span></h1>
          <p>
            Meet JurisAI—Your intelligent legal companion.<br />
            Get instant, accurate insights into Indian laws, acts, and regulations directly from your browser.
          </p>
          <div className="cta-buttons">
            <Link to="/JurisBot" className="cta-btn primary">Consult JurisAI</Link>
            <Link to="/contact" className="cta-btn secondary">Connect With Us</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="spline-wrapper">
            <SplineScene className="hero-canvas" interactive={true} />
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="landing-bento-section">
        <div className="section-header">
          <h2>Why Choose JurisAI?</h2>
          <p>Engineered for precision. Built for everyone.</p>
        </div>
        
        <div className="landing-bento-grid">
          <div className="l-bento-card span-col-2 highlight">
            <div className="l-bento-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>Instant Legal Insights</h3>
            <p>Don't wait days for a consultation. Ask complex legal questions and get precise answers backed by official Indian legal statutes in milliseconds.</p>
          </div>

          <div className="l-bento-card">
            <div className="l-bento-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Action-Oriented Guidance</h3>
            <p>Understand your legal rights, obligations, and the exact next steps to take for your unique situation.</p>
          </div>

          <div className="l-bento-card">
            <div className="l-bento-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3>AI-Powered Accuracy</h3>
            <p>Trained on an extensive dataset of Indian penal codes, IT acts, and comprehensive legal frameworks.</p>
          </div>

          <div className="l-bento-card span-col-2">
            <div className="l-bento-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3>100% Secure & Confidential</h3>
            <p>Your legal inquiries are strictly confidential. We employ military-grade encryption to ensure your data never leaves the encrypted sandbox.</p>
          </div>
        </div>
      </section>

      {/* Floating Timeline / How it works */}
      <section className="landing-timeline">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three steps to legal clarity.</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Ask Your Legal Question</h3>
              <p>Type any legal concern—from business compliance and cyber laws to personal rights and property disputes.</p>
            </div>
          </div>
          
          <div className="timeline-step offset">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>Get Trusted Answers</h3>
              <p>JurisAI analyzes your query using advanced NLP, retrieving the exact relevant legal documents and context.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Empower Yourself</h3>
              <p>Make informed decisions with reliable, easy-to-understand legal knowledge and printable action plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Glass CTA */}
      <section className="landing-cta-glass">
        <div className="cta-glass-content">
          <h2>Got a Legal Question? <br/>Demystify the Law Today.</h2>
          <p>Start your consultation now and take control of your legal rights.</p>
          <Link to="/JurisBot" className="cta-btn primary cta-large">Talk to JurisAI</Link>
        </div>
        <div className="cta-bg-elements">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
