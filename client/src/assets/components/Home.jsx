import React from "react";
import "./About1.css";

const About1 = () => {
  return (
    <div className="about-modern-layout">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <h1 className="bento-title">
            Your Intelligent <br />
            <span className="gradient-text-alt">Legal Companion</span>
          </h1>
          <p className="bento-subtitle">
            JurisAI represents a paradigm shift in legal tech. We empower individuals and businesses with instant, accurate insights into Indian law, transforming complex legal jargon into actionable clarity.
          </p>
        </div>
        <div className="about-hero-graphic">
          <div className="glowing-orb"></div>
          <div className="glass-panel">
            <div className="glass-panel-header">JurisAI Analysis</div>
            <div className="glass-line"></div>
            <div className="glass-line short"></div>
            <div className="glass-line medium"></div>
          </div>
        </div>
      </section>

      {/* Bento Box Features */}
      <section className="bento-grid-section">
        <div className="bento-header">
          <h2>Capabilities Engineered for Precision</h2>
        </div>
        
        <div className="bento-grid">
          {/* Large Card */}
          <div className="bento-card span-2 highlight-card">
            <div className="bento-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3>Comprehensive Legal Intelligence</h3>
            <p>Our NLP engine is trained extensively on the Indian Penal Code, IT Acts, and corporate compliance frameworks to deliver enterprise-grade accuracy 24/7.</p>
          </div>

          {/* Normal Cards */}
          <div className="bento-card">
            <h3>Automated Case Analysis</h3>
            <p>Upload details or describe your issue, and JurisAI automatically correlates it with relevant past judgments and sections.</p>
          </div>

          <div className="bento-card">
            <h3>Actionable Next Steps</h3>
            <p>We don't just provide laws. We give you a step-by-step roadmap on filing complaints, serving notices, or contacting authorities.</p>
          </div>

          {/* Wide Card */}
          <div className="bento-card span-2">
            <h3>Location-Aware Network</h3>
            <p>Instantly find nearby cybercrime cells, police stations, and certified legal authorities with dynamically generated directories tailored to your jurisdiction.</p>
          </div>

          <div className="bento-card dark-card">
            <h3>Document Drafting</h3>
            <p>Generate standard NDAs, legal notices, and compliance reports in seconds.</p>
          </div>
        </div>
      </section>

      {/* Split Section */}
      <section className="split-section">
        <div className="split-left">
          <h2>Who Powers Their Decisions With JurisAI?</h2>
          <p>Designed for scale and accessibility, our architecture serves a diverse ecosystem of users.</p>
        </div>
        <div className="split-right">
          <div className="user-persona">
            <h4>01. Individuals</h4>
            <p>Victims of cybercrime or fraud seeking immediate legal awareness without high consultancy fees.</p>
          </div>
          <div className="user-persona">
            <h4>02. Enterprises</h4>
            <p>Startups and corporations automating compliance checks and contract auditing.</p>
          </div>
          <div className="user-persona">
            <h4>03. Legal Professionals</h4>
            <p>Lawyers and law enforcement accelerating their precedent research and case preparation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About1;
