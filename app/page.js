'use client';

import React, { useState } from 'react';

export default function Home() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      platform: 'Facebook',
      name: 'Sarah Martinez',
      lastMessage: 'Do you offer bulk discounts?',
      timestamp: '2 mins ago',
      unread: true,
      flagged: false,
      category: 'inquiry',
      messages: [
        { role: 'user', content: 'Hi! I\'m interested in your products', sender: 'Sarah', time: '5 mins ago' },
        { role: 'user', content: 'Do you offer bulk discounts?', sender: 'Sarah', time: '2 mins ago' }
      ]
    },
    {
      id: 2,
      platform: 'Instagram',
      name: 'Mike Chen',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '15 mins ago',
      unread: false,
      flagged: true,
      category: 'positive',
      messages: [
        { role: 'user', content: 'Is shipping available in my area?', sender: 'Mike', time: '30 mins ago' },
        { role: 'assistant', content: 'Yes! We ship nationwide.', sender: 'You', time: '20 mins ago' },
        { role: 'user', content: 'Thanks for the quick response!', sender: 'Mike', time: '15 mins ago' }
      ]
    },
    {
      id: 3,
      platform: 'TikTok',
      name: 'Jordan Lee',
      lastMessage: 'When will you restock?',
      timestamp: '1 hour ago',
      unread: true,
      flagged: false,
      category: 'inquiry',
      messages: [
        { role: 'user', content: 'Love your products! When will you restock?', sender: 'Jordan', time: '1 hour ago' }
      ]
    }
  ]);

  const [selectedConv, setSelectedConv] = useState(null);
  const [draftReply, setDraftReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  const templates = [
    {
      name: 'Thank you & shipping',
      text: 'Thank you for your interest! We offer fast shipping to most areas. Feel free to reach out with any questions!'
    },
    {
      name: 'Bulk discount inquiry',
      text: 'Great question! For bulk orders, please provide details about your needs and I\'ll send you a custom quote.'
    },
    {
      name: 'Restock update',
      text: 'Thanks for the interest! We\'re currently restocking and items should be available soon. I\'ll keep you posted!'
    },
    {
      name: 'General inquiry',
      text: 'Thanks for reaching out! How can I help you today?'
    }
  ];

  const generateReply = async () => {
    if (!selectedConv || !apiKey) {
      alert('Please select a conversation and enter your API key');
      return;
    }

    setIsGenerating(true);
    try {
      const conv = conversations.find(c => c.id === selectedConv);
      const lastUserMsg = conv.messages.findLast(m => m.role === 'user')?.content || '';
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `You are a professional social media assistant. Draft a brief, friendly reply to this message. Keep it under 150 characters. Message: "${lastUserMsg}"`
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API error');
      }

      const data = await response.json();
      const replyText = data.content[0].text;
      setDraftReply(replyText);
    } catch (error) {
      alert('Error generating reply. Check your API key: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReply = () => {
    if (!selectedConv || !draftReply.trim()) return;

    const updatedConvs = conversations.map(c => {
      if (c.id === selectedConv) {
        return {
          ...c,
          messages: [...c.messages, { role: 'assistant', content: draftReply, sender: 'You', time: 'now' }],
          unread: false
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setDraftReply('');
    alert('Reply sent!');
  };

  const toggleFlag = (id) => {
    setConversations(conversations.map(c =>
      c.id === id ? { ...c, flagged: !c.flagged } : c
    ));
  };

  const addNewMessage = () => {
    const name = prompt('Contact name:');
    const platform = prompt('Platform (Facebook/Instagram/TikTok):');
    const message = prompt('Their message:');
    
    if (name && platform && message) {
      const newConv = {
        id: Math.max(...conversations.map(c => c.id), 0) + 1,
        platform,
        name,
        lastMessage: message,
        timestamp: 'now',
        unread: true,
        flagged: false,
        category: 'inquiry',
        messages: [{ role: 'user', content: message, sender: name, time: 'now' }]
      };
      setConversations([...conversations, newConv]);
    }
  };

  const current = conversations.find(c => c.id === selectedConv);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)', padding: '16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '16px', height: 'calc(100vh - 32px)' }}>
        {/* Sidebar */}
        <div style={{ width: '280px', background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '500' }}>Social Media Agent</h1>
            <button
              onClick={() => setShowApiInput(!showApiInput)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-background-secondary)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                fontWeight: '500'
              }}
            >
              <i className="ti ti-key" style={{ marginRight: '6px' }}></i>
              {apiKey ? 'API Key Set ✓' : 'Add API Key'}
            </button>
            {showApiInput && (
              <input
                type="password"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            )}
            <button
              onClick={addNewMessage}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px',
                fontSize: '13px',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-background-info)',
                color: 'var(--color-text-info)',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <i className="ti ti-plus" style={{ marginRight: '6px' }}></i>
              Add Message
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                style={{
                  padding: '12px',
                  marginBottom: '6px',
                  borderRadius: 'var(--border-radius-md)',
                  border: selectedConv === conv.id ? '0.5px solid var(--color-border-primary)' : '0.5px solid var(--color-border-tertiary)',
                  background: selectedConv === conv.id ? 'var(--color-background-secondary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                      {conv.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {conv.platform}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFlag(conv.id); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 8px',
                      color: conv.flagged ? 'var(--color-text-warning)' : 'var(--color-text-secondary)',
                      fontSize: '16px'
                    }}
                  >
                    <i className={conv.flagged ? 'ti ti-flag-filled' : 'ti ti-flag'}></i>
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  {conv.lastMessage.substring(0, 45)}...
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                    {conv.timestamp}
                  </span>
                  {conv.unread && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-background-info)'
                    }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        {current ? (
          <div style={{ flex: 1, background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '16px', minHeight: '80px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                {current.name}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {current.platform} • {current.messages.length} messages
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {current.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'assistant' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 14px',
                      borderRadius: 'var(--border-radius-lg)',
                      background: msg.role === 'assistant' ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                      color: msg.role === 'assistant' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                      fontSize: '13px',
                      lineHeight: '1.5'
                    }}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '4px', fontSize: '12px' }}>
                      {msg.sender}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Area */}
            <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)', padding: '16px', background: 'var(--color-background-secondary)' }}>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={generateReply}
                  disabled={isGenerating || !apiKey}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: '0.5px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    background: isGenerating ? 'var(--color-background-secondary)' : 'var(--color-background-info)',
                    color: isGenerating ? 'var(--color-text-tertiary)' : 'var(--color-text-info)',
                    cursor: isGenerating || !apiKey ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="ti ti-sparkles" style={{ marginRight: '6px' }}></i>
                  {isGenerating ? 'Generating...' : 'Generate AI Reply'}
                </button>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  style={{
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: '0.5px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <i className="ti ti-template"></i>
                </button>
              </div>

              {showTemplates && (
                <div style={{ marginBottom: '12px', display: 'grid', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {templates.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDraftReply(t.text); setShowTemplates(false); }}
                      style={{
                        padding: '10px',
                        fontSize: '12px',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-md)',
                        background: 'var(--color-background-primary)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: '500'
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                placeholder="Draft your reply or use AI to generate one..."
                style={{
                  width: '100%',
                  minHeight: '90px',
                  padding: '12px',
                  fontSize: '13px',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px',
                  resize: 'vertical',
                  background: 'var(--color-background-primary)'
                }}
              />

              <button
                onClick={sendReply}
                disabled={!draftReply.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '0.5px solid var(--color-border-success)',
                  borderRadius: 'var(--border-radius-md)',
                  background: draftReply.trim() ? 'var(--color-background-success)' : 'var(--color-background-secondary)',
                  color: draftReply.trim() ? 'var(--color-text-success)' : 'var(--color-text-tertiary)',
                  cursor: draftReply.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                <i className="ti ti-send" style={{ marginRight: '6px' }}></i>
                Send Reply
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '16px', padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>
                <i className="ti ti-message-circle"></i>
              </div>
              <p>Select a conversation to get started</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--color-text-tertiary)' }}>
                Or click "Add Message" to manually add conversations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
