import React, { useState, useEffect, useRef } from "react";
import "./JurisBot.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

const JurisBot = () => {
    // Multi-chat State
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);
    
    // Active Chat State
    const [userInput, setUserInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    
    // Refs
    const chatWindowRef = useRef(null);
    const lastMessageRef = useRef(null);
    const textareaRef = useRef(null);

    // Initialize & Load from LocalStorage
    useEffect(() => {
        const savedChats = localStorage.getItem("juris_all_chats");
        if (savedChats) {
            try {
                const parsed = JSON.parse(savedChats);
                setChats(parsed);
                if (parsed.length > 0) {
                    setActiveChatId(parsed[0].id);
                } else {
                    startNewChat();
                }
            } catch (error) {
                console.error("Failed to load chats:", error);
                startNewChat();
            }
        } else {
            startNewChat();
        }

        const handleResize = () => {
            if (window.innerWidth <= 900) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-save whenever chats array changes
    useEffect(() => {
        if (chats.length > 0) {
            localStorage.setItem("juris_all_chats", JSON.stringify(chats));
        }
    }, [chats]);

    const activeChat = chats.find(c => c.id === activeChatId) || { messages: [] };

    const startNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: "New Legal Query",
            messages: []
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setUserInput("");
        if (window.innerWidth <= 900) setIsSidebarOpen(false);
    };

    const deleteChat = (e, id) => {
        e.stopPropagation();
        const updatedChats = chats.filter(c => c.id !== id);
        setChats(updatedChats);
        if (updatedChats.length === 0) {
            startNewChat();
        } else if (activeChatId === id) {
            setActiveChatId(updatedChats[0].id);
        }
    };

    const updateActiveChatMessages = (newMessages, autoTitle = null) => {
        setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
                return { 
                    ...chat, 
                    messages: newMessages,
                    title: autoTitle ? autoTitle : chat.title
                };
            }
            return chat;
        }));
    };

    const handleUserInput = async () => {
        if (!userInput.trim()) return;

        const currentMessage = userInput;
        
        // Auto-generate title if this is the first message
        let generatedTitle = null;
        if (activeChat.messages.length === 0) {
            generatedTitle = currentMessage.length > 25 ? currentMessage.substring(0, 25) + '...' : currentMessage;
        }

        const newMessages = [...activeChat.messages, { content: currentMessage, sender: "user", id: Date.now() }];
        updateActiveChatMessages(newMessages, generatedTitle);
        setUserInput("");
        
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setIsThinking(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: currentMessage })
            });

            if (!response.ok) throw new Error("Server response was not ok.");

            const data = await response.json();
            
            const botMessage = {
                content: data.error ? data.error : data.response,
                sender: "bot",
                sources: data.error ? null : data.sources,
                id: Date.now() + 1
            };
            
            updateActiveChatMessages([...newMessages, botMessage]);

        } catch (error) {
            console.error("Chatbot Error:", error);
            updateActiveChatMessages([...newMessages, { content: "Sorry, I encountered an error while processing your request.", sender: "bot", id: Date.now() + 1 }]);
        } finally {
            setIsThinking(false);
        }
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeChat.messages, isThinking]);

    const renderMarkdown = (markdown) => {
        const rawHtml = marked.parse(markdown || '');
        return DOMPurify.sanitize(rawHtml);
    };

    return (
        <div className="juris-layout">
            
            {/* Sidebar (ChatGPT Style) */}
            <div className={`juris-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <button onClick={startNewChat} className="new-chat-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Chat
                    </button>
                    <button className="close-sidebar-mobile" onClick={() => setIsSidebarOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div className="sidebar-chat-list">
                    <div className="history-label">Recent Consultations</div>
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                            onClick={() => { setActiveChatId(chat.id); if (window.innerWidth <= 900) setIsSidebarOpen(false); }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span className="chat-title">{chat.title}</span>
                            <button className="delete-chat" onClick={(e) => deleteChat(e, chat.id)} title="Delete chat">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="juris-chat-container">
                {/* Mobile Hamburger / Header */}
                <div className="mobile-chat-header">
                    <button onClick={() => setIsSidebarOpen(true)} className="hamburger-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="mobile-title">JurisAI</span>
                </div>

                <div className="juris-messages" ref={chatWindowRef}>
                    {activeChat.messages.length === 0 && (
                        <div className="juris-empty-state">
                            <div className="juris-logo-glow"></div>
                            <div className="juris-icon-pulse">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gradientMain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="gradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ff6b00" />
                                            <stop offset="100%" stopColor="#6b5bff" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                            </div>
                            <h1 className="juris-brand">JurisAI</h1>
                            <p className="juris-subtitle">How can I assist you with Indian Law today?</p>
                            
                            <div className="juris-suggestions stagger-in">
                                <button onClick={() => setUserInput("Draft an NDA under Indian Corporate Law")} className="suggestion-chip">
                                    Draft an NDA
                                </button>
                                <button onClick={() => setUserInput("Explain the DPDP Act 2023 for a startup")} className="suggestion-chip">
                                    DPDP Act for Startups
                                </button>
                                <button onClick={() => setUserInput("What is the legal process for filing a cybercrime FIR?")} className="suggestion-chip">
                                    Cybercrime FIR Process
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeChat.messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`juris-message-row ${msg.sender === 'user' ? 'row-user' : 'row-bot'} message-pop-in`}
                            ref={index === activeChat.messages.length - 1 && !isThinking ? lastMessageRef : null}
                        >
                            <div className="juris-message-inner">
                                <div className="juris-avatar scale-in">
                                    {msg.sender === 'user' ? (
                                        <div className="avatar-user">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                    ) : (
                                        <div className="avatar-bot">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ff6b00" />
                                                        <stop offset="100%" stopColor="#6b5bff" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="juris-message-body fade-in-up">
                                    {msg.sender === 'user' ? (
                                        <div className="juris-content">{msg.content}</div>
                                    ) : (
                                        <div className="juris-content markdown-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                                    )}
                                    
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="juris-sources-container delay-fade">
                                            <div className="sources-title">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                                Referenced Legal Documents
                                            </div>
                                            <div className="sources-flex">
                                                {msg.sources.map((src, idx) => (
                                                    <div key={idx} className="source-chip hover-lift" title={src.answer}>
                                                        <span className="source-number">{idx + 1}</span>
                                                        <span className="source-law">{src.laws && src.laws.length > 0 ? src.laws[0] : "Legal Reference"}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="juris-message-row row-bot message-pop-in" ref={lastMessageRef}>
                            <div className="juris-message-inner">
                                <div className="juris-avatar scale-in">
                                    <div className="avatar-bot">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#ff6b00" />
                                                    <stop offset="100%" stopColor="#6b5bff" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="juris-message-body fade-in-up">
                                    <div className="searching-animation-wrapper">
                                        <div className="search-spinner"></div>
                                        <span className="search-text">Searching legal databases & analyzing precedents...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="juris-input-area input-slide-up">
                    <div className="juris-input-inner">
                        <div className="juris-input-box">
                            <textarea
                                ref={textareaRef}
                                className="juris-textarea"
                                placeholder="Message JurisAI..."
                                value={userInput}
                                onChange={(e) => {
                                    setUserInput(e.target.value);
                                    autoResize();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleUserInput();
                                    }
                                }}
                                rows={1}
                            />
                            <button 
                                className={`juris-send-btn ${userInput.trim() ? 'active' : ''}`}
                                onClick={handleUserInput}
                                disabled={!userInput.trim() || isThinking}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                        <p className="juris-disclaimer">JurisAI can make mistakes. Always verify critical legal facts.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JurisBot;
