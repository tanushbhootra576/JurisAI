import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: 'AI in Business: A Legal Revolution',
      preview: 'Discover how AI is transforming business operations and legal compliance frameworks across the Indian corporate landscape.',
      content: 'AI is revolutionizing how businesses manage legal risk. Tools like Juris AI automate contract analysis, compliance checks, and legal research. These solutions save time and reduce human error in legal operations, ensuring that your enterprise stays ahead of regulatory shifts such as the Digital Personal Data Protection Act.',
      author: 'Juris AI Expert',
      date: 'April 12, 2025',
      category: 'Enterprise'
    },
    {
      id: 2,
      title: 'Understanding Digital Evidence in Indian Law',
      preview: 'Digital evidence can be tricky to validate. Learn what Section 65B of the Indian Evidence Act means for you.',
      content: 'Courts in India accept digital evidence if it follows Section 65B of the Indian Evidence Act. Learn how Juris AI helps validate and format digital evidence for legal use. From WhatsApp chats to email logs, understanding the admissibility of electronic records is paramount in modern litigation.',
      author: 'Criminal Law Professor',
      date: 'April 2, 2025',
      category: 'Cyber Law'
    },
    {
      id: 3,
      title: 'How Juris AI Simplifies Legal Compliance',
      preview: 'Struggling with compliance? Juris AI automates the heavy lifting for modern startups.',
      content: 'Compliance with GDPR, HIPAA, and other frameworks can be challenging. Juris AI simplifies this by automating policy checks, generating compliance reports, and offering legal summaries for businesses.',
      author: 'Legal Analyst',
      date: 'April 9, 2025',
      category: 'Compliance'
    },
    {
      id: 4,
      title: 'Cybercrime Laws Every Startup Should Know',
      preview: 'Startups are vulnerable. Learn the key IPC sections related to cyber threats.',
      content: 'From data theft to phishing, startups face several cyber threats. This blog explains the key IPC sections related to cybercrime and how Juris AI helps identify legal actions against offenders.',
      author: 'Startup Legal Advisor',
      date: 'April 5, 2025',
      category: 'Startups'
    },
    {
      id: 5,
      title: 'Contract Automation: A Game-Changer for SMEs',
      preview: 'SMEs can now draft and review contracts automatically without expensive retainers.',
      content: 'Small businesses often overlook the legal fine print. Juris AI helps draft, review, and flag issues in contracts using AI-based legal reasoning. No more costly legal mistakes.',
      author: 'Legal Tech Specialist',
      date: 'April 4, 2025',
      category: 'Contracts'
    },
    {
      id: 6,
      title: 'Digital Footprint and Legal Consequences',
      preview: 'Your online presence can be used in court. Understand the legal ramifications of your digital trail.',
      content: 'Public social media posts, old comments, and leaked data can lead to defamation or privacy lawsuits. Juris AI helps identify risky digital traces and recommends safe actions.',
      author: 'Privacy Law Consultant',
      date: 'March 24, 2025',
      category: 'Privacy'
    }
  ];

  if (selectedPost) {
    return (
      <div className="blog-reader-layout">
        <button className="reader-back-btn" onClick={() => setSelectedPost(null)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Articles
        </button>
        <article className="reader-article">
          <div className="reader-header">
            <span className="reader-category">{selectedPost.category}</span>
            <h1>{selectedPost.title}</h1>
            <div className="reader-meta">
              <div className="reader-author-avatar"></div>
              <div className="reader-meta-text">
                <span className="author-name">{selectedPost.author}</span>
                <span className="publish-date">{selectedPost.date}</span>
              </div>
            </div>
          </div>
          <div className="reader-content">
            <p className="reader-lead">{selectedPost.preview}</p>
            <p>{selectedPost.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
          </div>
        </article>
      </div>
    );
  }

  const heroPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1);

  return (
    <div className="blog-modern-layout">
      <div className="blog-header">
        <h1>JurisAI <span className="gradient-text">Insights</span></h1>
        <p>Expert perspectives on Indian law, cybersecurity, and the future of legal tech.</p>
      </div>

      {/* Hero Post */}
      <div className="blog-hero-post" onClick={() => setSelectedPost(heroPost)}>
        <div className="hero-post-image"></div>
        <div className="hero-post-content">
          <span className="post-category">{heroPost.category}</span>
          <h2>{heroPost.title}</h2>
          <p>{heroPost.preview}</p>
          <div className="post-meta">
            <span>{heroPost.author}</span> • <span>{heroPost.date}</span>
          </div>
        </div>
      </div>

      {/* Grid Posts */}
      <div className="blog-grid">
        {gridPosts.map(post => (
          <div key={post.id} className="blog-card" onClick={() => setSelectedPost(post)}>
            <div className="blog-card-image"></div>
            <div className="blog-card-content">
              <span className="post-category">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.preview}</p>
              <div className="post-meta">
                <span>{post.author}</span> • <span>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
