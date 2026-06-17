import React from 'react'
import './Business.css'

const Business = () => {
  return (
    <div className="biz-modern-layout">
      {/* Enterprise Hero Section */}
      <section className="biz-hero">
        <div className="biz-hero-bg-glow"></div>
        <div className="biz-hero-content">
          <div className="biz-badge">Enterprise Grade</div>
          <h1 className="biz-title">
            Legal Infrastructure <br />
            <span className="biz-gradient">For Modern Teams</span>
          </h1>
          <p className="biz-desc">
            Scale your legal operations, automate compliance checks, and minimize risk with JurisAI's comprehensive B2B suite.
          </p>
          <button className="biz-cta-button">Request Enterprise Demo</button>
        </div>
      </section>

      {/* Split Feature Scroll */}
      <section className="biz-split-scroll">
        <div className="biz-sticky-left">
          <h2>Deploy Legal Intelligence at Scale</h2>
          <p>JurisAI integrates seamlessly into your corporate workflows, delivering AI-driven legal insights without the traditional overhead.</p>
        </div>
        <div className="biz-scroll-right">
          <div className="biz-feature-card">
            <div className="biz-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg>
            </div>
            <h3>Contract Auditing</h3>
            <p>Upload multi-page SLAs, vendor agreements, and NDAs. JurisAI instantly highlights risky clauses, non-compliant terms, and missing stipulations according to Indian Corporate Law.</p>
          </div>

          <div className="biz-feature-card">
            <div className="biz-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3>Compliance Enforcement</h3>
            <p>Automate continuous monitoring for data privacy laws (DPDP Act), employment regulations, and tax statutes. Never miss an update to national compliance requirements.</p>
          </div>

          <div className="biz-feature-card">
            <div className="biz-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3>IP & Brand Protection</h3>
            <p>Proactively scan and receive actionable legal steps for intellectual property infringement, trademark violations, and digital brand impersonation.</p>
          </div>
        </div>
      </section>

      {/* Tech Specs Bento */}
      <section className="biz-tech-specs">
        <div className="biz-spec-card">
          <h4>24/7 Availability</h4>
          <p>Instant legal consultations around the clock for your entire workforce.</p>
        </div>
        <div className="biz-spec-card highlight">
          <h4>Bank-Grade Security</h4>
          <p>End-to-end encryption ensures your proprietary data and contracts remain strictly confidential.</p>
        </div>
        <div className="biz-spec-card">
          <h4>API Integration</h4>
          <p>Connect JurisAI directly into your internal Slack, Teams, or custom ERP systems.</p>
        </div>
      </section>
    </div>
  )
}

export default Business
