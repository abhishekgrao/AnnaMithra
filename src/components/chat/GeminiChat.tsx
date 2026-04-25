import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../../lib/gemini';
import { supabase } from '../../lib/supabase';
import { MOCK_FOOD_ITEMS } from '../../data/mockData';
import './GeminiChat.css';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

export const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I am Symbiot, your AI assistant for AnnaMithra. How can I help you today? 🍎' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          // Personalized greeting
          setMessages([
            { role: 'ai', text: `Hi ${profile.full_name}! I am Symbiot. As a ${profile.role === 'ngo' ? 'NGO partner' : 'donor'}, I can help you with ${profile.role === 'ngo' ? 'finding food' : 'tracking donations'}. How can I assist you today?` }
          ]);
        }
      }
    } catch (err) {
      console.error('Error fetching profile for chat:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Fetch current listings for context
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .neq('status', 'Claimed');

      const liveListings = listings ? listings.map((l: any) => ({
        name: l.title,
        shop: l.shop_name,
        quantity: l.quantity,
        expires_at: l.expires_at,
        urgency: l.urgency_score
      })) : [];

      const mockListings = MOCK_FOOD_ITEMS.map(m => ({
        name: m.name,
        shop: m.donor,
        quantity: m.quantity,
        expires_at: m.expiry,
        urgency: m.urgencyScore
      }));

      const allListings = [...liveListings, ...mockListings];

      // Personalized user metrics for context
      const userContext = userProfile ? `
        User Role: ${userProfile.role}
        Organization: ${userProfile.organization_name || 'Individual'}
        Kindness Score: ${userProfile.kindness_score}
        ${userProfile.role === 'donor' ? 'Metrics: 124 Items Donated this month, ₹4,500 Tax Benefits eligible.' : 'NGO Dashboard: View nearby donations and manage claims.'}
      ` : 'User is a guest.';

      const listingsContext = allListings.length > 0 
        ? `Current Active Food Listings: ${JSON.stringify(allListings)}`
        : "No active food listings currently available.";

      // Map history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const contextEnhancedMessage = `User Identity: ${userContext}\n\nListings: ${listingsContext}\n\nUser Question: ${userMessage}`;
      const response = await getGeminiResponse(history, contextEnhancedMessage);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to my brain. Please try again later!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gemini-chat-container">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Sparkles size={20} />
              </div>
              <div className="chat-title">
                <h3>Symbiot AI</h3>
                <div className="chat-status">
                  <span className="status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message message-${m.role}`}>
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask Symbiot anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-bubble" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
          <div style={{ 
            position: 'absolute', 
            top: -5, 
            right: -5, 
            background: '#ff4d4f', 
            color: 'white', 
            fontSize: '10px', 
            padding: '2px 6px', 
            borderRadius: '10px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>AI</div>
        </div>
      )}
    </div>
  );
};
