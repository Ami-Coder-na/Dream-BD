
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft, Loader2, User as UserIcon, Sparkles, Paperclip, X as XIcon, Image as ImageIcon, Mic, ThumbsUp, ThumbsDown, MessageSquare, Clock, Plus, Menu, Trash2 } from 'lucide-react';
import { generateAssistantResponse } from '../services/geminiService';
import { ChatMessage, Attachment, ChatSession } from '../types';

interface AiChatPageProps {
  onBack: () => void;
  isBangla: boolean;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onBack, isBangla }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultWelcomeMessage: ChatMessage = {
    id: 'init',
    role: 'model',
    text: isBangla 
      ? 'স্বাগতম! আমি ড্রিম বিডি এআই। কৃষি, স্বাস্থ্য, শিক্ষা বা অন্য যেকোনো বিষয়ে আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনি ছবি বা অডিও পাঠাতে পারেন।' 
      : 'Welcome! I am Dream BD AI. How can I assist you today? You can also share images or audio for analysis.',
    timestamp: new Date()
  };

  // Initialize sessions from LocalStorage or use Mock Data
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('dream_bd_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Revive Date objects from strings
        return parsed.map((session: any) => ({
          ...session,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }

    // Default Mock Data if no history
    return [
      { 
        id: '1', 
        title: 'Rice Farming Issue', 
        date: 'Today', 
        preview: 'How to cure blast disease...',
        messages: [
          { id: 'm1-1', role: 'user', text: 'How to cure blast disease?', timestamp: new Date(Date.now() - 86400000) },
          { id: 'm1-2', role: 'model', text: 'Use Tricyclazole to control blast disease.', timestamp: new Date(Date.now() - 86390000) }
        ]
      },
      { 
        id: '2', 
        title: 'Doctor Appointment', 
        date: 'Yesterday', 
        preview: 'Schedule for Dr. Rahim...',
        messages: [
          { id: 'm2-1', role: 'user', text: 'I need an appointment with Dr. Rahim', timestamp: new Date(Date.now() - 172800000) },
          { id: 'm2-2', role: 'model', text: 'Dr. Rahim sees patients from 5 PM to 8 PM.', timestamp: new Date(Date.now() - 172790000) }
        ]
      }
    ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist sessions to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dream_bd_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
       alert(isBangla ? 'অনুগ্রহ করে শুধু ছবি বা অডিও ফাইল নির্বাচন করুন।' : 'Please select only image or audio files.');
       return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      const base64Data = base64String.split(',')[1];
      const type = file.type.startsWith('image/') ? 'image' : 'audio';

      setSelectedFile({
        type,
        url: base64String,
        base64: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSessionSelect = (session: ChatSession) => {
    if (loading) return; // Prevent switching while generating
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    if (loading) return; // Prevent switching while generating
    setActiveSessionId(null);
    setMessages([defaultWelcomeMessage]);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (window.confirm(isBangla ? 'আপনি কি এই চ্যাটটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this chat?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      attachment: selectedFile || undefined,
      timestamp: new Date()
    };

    // Optimistically update UI
    const msgsAfterUser = [...messages, userMsg];
    setMessages(msgsAfterUser);
    
    setInput('');
    const currentAttachment = selectedFile;
    setSelectedFile(null);
    setLoading(true);

    const historyForApi = messages.filter(m => m.id !== 'init').map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await generateAssistantResponse(
      input || (isBangla ? '[ফাইল পাঠানো হয়েছে]' : '[File sent]'), 
      `User is on the public AI Help Page.`,
      historyForApi,
      currentAttachment ? { mimeType: currentAttachment.mimeType!, data: currentAttachment.base64! } : undefined
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    const finalMessages = [...msgsAfterUser, botMsg];
    setMessages(finalMessages);
    setLoading(false);

    // Update or Create Session
    const now = new Date();
    
    if (activeSessionId) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            preview: botMsg.text.substring(0, 40) + '...',
            messages: finalMessages,
            date: 'Today'
          };
        }
        return s;
      }));
    } else {
      const newSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: newSessionId,
        title: input.substring(0, 30) || (isBangla ? 'নতুন আলাপ' : 'New Conversation'),
        date: 'Today',
        preview: botMsg.text.substring(0, 40) + '...',
        messages: finalMessages
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
    }
  };

  const handleFeedback = (msgId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, feedback: type } : msg
    ));
    
    if (activeSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: s.messages.map(m => m.id === msgId ? { ...m, feedback: type } : m) }
          : s
      ));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - History */}
      <aside className={`fixed md:relative z-30 w-72 h-full bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <Clock size={18} />
            {isBangla ? 'পূর্ববর্তী আলাপ' : 'Chat History'}
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-200 rounded">
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-3">
          <button 
             onClick={handleNewChat}
             disabled={loading}
             className={`w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={18} />
            {isBangla ? 'নতুন চ্যাট শুরু করুন' : 'New Chat'}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-3 pb-4 space-y-4 ${loading ? 'pointer-events-none opacity-60' : ''}`}>
          {sessions.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">
              {isBangla ? 'কোন ইতিহাস নেই' : 'No chat history'}
            </p>
          )}
          
          {/* Recent Sessions */}
          {sessions.length > 0 && (
            <div>
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase mb-2 mt-2">{isBangla ? 'সাম্প্রতিক' : 'Recent'}</p>
              {sessions.map(session => (
                <div 
                  key={session.id} 
                  onClick={() => handleSessionSelect(session)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border group mb-2 relative ${
                    activeSessionId === session.id 
                      ? 'bg-white border-brand-200 shadow-sm ring-1 ring-brand-100' 
                      : 'border-transparent hover:bg-white hover:shadow-sm hover:border-gray-200'
                  }`}
                >
                  <div className="pr-6">
                    <h4 className={`font-medium text-sm truncate ${activeSessionId === session.id ? 'text-brand-700' : 'text-gray-800'}`}>
                      {session.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{session.preview}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="absolute right-2 top-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* User Mini Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-100">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold">
               G
             </div>
             <div>
               <p className="text-sm font-bold text-gray-800">{isBangla ? 'অতিথি' : 'Guest User'}</p>
               <p className="text-xs text-green-600">Free Plan</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 md:hidden hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white shadow-md relative">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  {isBangla ? 'ড্রিম এআই' : 'Dream AI'} 
                  <Sparkles size={14} className="text-yellow-500" fill="currentColor" />
                </h1>
                <p className="text-xs text-gray-500">{isBangla ? 'আপনার স্মার্ট সহকারী' : 'Your Smart Assistant'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                {/* Bot Avatar */}
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100 mt-1">
                    <Sparkles size={14} className="text-brand-600" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Name & Time */}
                  <div className={`flex items-center gap-2 text-[10px] text-gray-400 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} mb-1`}>
                    <span className="font-medium">{msg.role === 'user' ? (isBangla ? 'আপনি' : 'You') : 'Dream AI'}</span>
                    <span>•</span>
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Attachment Display */}
                  {msg.attachment && (
                    <div className={`rounded-xl overflow-hidden border ${msg.role === 'user' ? 'border-brand-500' : 'border-gray-200'} mb-1 bg-gray-50`}>
                      {msg.attachment.type === 'image' ? (
                        <img src={msg.attachment.url} alt="Attached" className="max-w-xs max-h-60 object-cover" />
                      ) : (
                        <div className="p-3 flex items-center gap-2 min-w-[200px]">
                          <Mic size={20} className="text-gray-600" />
                          <audio controls src={msg.attachment.url} className="h-8 w-48" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Message Bubble */}
                  {msg.text && (
                    <div
                      className={`rounded-2xl px-5 py-3 shadow-sm text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Feedback Actions for Bot Messages */}
                  {msg.role === 'model' && msg.id !== 'init' && (
                    <div className="flex items-center gap-3 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleFeedback(msg.id, 'positive')}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback === 'positive' ? 'text-green-600' : 'text-gray-400'}`}
                        title="Helpful"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button 
                        onClick={() => handleFeedback(msg.id, 'negative')}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${msg.feedback === 'negative' ? 'text-red-500' : 'text-gray-400'}`}
                        title="Not Helpful"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 mt-1">
                    <UserIcon size={14} className="text-gray-500" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start gap-4 animate-pulse">
                 <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100 mt-1">
                    <Sparkles size={14} className="text-brand-600" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                    <Loader2 size={18} className="animate-spin text-brand-600" />
                    <span className="text-sm text-gray-500 font-medium">{isBangla ? 'উত্তর তৈরি হচ্ছে...' : 'Dream AI is thinking...'}</span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            {/* File Preview */}
            {selectedFile && (
               <div className="mb-3 inline-flex bg-gray-50 border border-gray-200 rounded-lg p-2 items-center gap-3 animate-slide-up">
                 {selectedFile.type === 'image' ? (
                   <div className="relative">
                     <img src={selectedFile.url} alt="Preview" className="w-10 h-10 rounded object-cover border border-gray-300" />
                   </div>
                 ) : (
                   <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                     <Mic size={20} className="text-gray-500" />
                   </div>
                 )}
                 <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-700">{selectedFile.type === 'image' ? 'Image' : 'Audio'} attached</span>
                    <span className="text-[10px] text-gray-500">Ready to send</span>
                 </div>
                 <button 
                   onClick={() => setSelectedFile(null)}
                   className="ml-2 bg-white rounded-full p-1 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors"
                 >
                   <XIcon size={14} />
                 </button>
               </div>
            )}

            <div className="flex gap-2 items-end bg-gray-50 border border-gray-300 rounded-[2rem] p-2 focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 focus-within:bg-white transition-all shadow-sm">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,audio/*"
                onChange={handleFileSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors mb-[1px]"
                title={isBangla ? 'ছবি বা অডিও যুক্ত করুন' : 'Attach image or audio'}
              >
                <Paperclip size={20} />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isBangla ? 'এখানে লিখুন...' : 'Type your message...'}
                className="flex-1 bg-transparent border-none py-3 px-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 resize-none max-h-32 text-sm md:text-base scrollbar-hide"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedFile)}
                className={`p-3 rounded-full mb-[1px] shadow-sm transition-all transform ${
                  loading || (!input.trim() && !selectedFile)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 active:scale-95'
                }`}
              >
                <Send size={20} className={loading ? 'opacity-0' : 'opacity-100'} />
                {loading && <Loader2 size={20} className="absolute animate-spin text-gray-500" />}
              </button>
            </div>
            
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Dream AI • {isBangla ? 'গুরুত্বপূর্ণ তথ্যের জন্য যাচাই করুন' : 'Verify important info'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
