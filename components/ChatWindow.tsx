import React, { useState, useEffect, useRef } from 'react';
import { Professional, Message } from '../types';
import { geminiService } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
  professional: Professional;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ professional }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when professional changes
  useEffect(() => {
    setMessages([{
      id: 'intro',
      role: 'model',
      text: `Olá! Sou seu ${professional.title}. Como posso ajudar com ${professional.name} hoje?`,
      timestamp: new Date()
    }]);
    geminiService.startChat(professional);
  }, [professional]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let fullResponse = '';
      const responseMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for model response
      setMessages(prev => [...prev, {
        id: responseMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
      }]);

      const stream = geminiService.sendMessageStream(userText);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === responseMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Desculpe, tive um problema ao processar sua solicitação. Tente novamente.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-slate-800 bg-slate-800/30 flex items-center space-x-3`}>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${professional.gradient} shadow-lg`}>
          <span className="text-xl text-white">{professional.icon}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{professional.name}</h2>
          <p className="text-xs text-slate-400">{professional.title}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 group`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md
                  ${isUser ? 'bg-indigo-600 text-white' : `bg-gradient-to-br ${professional.gradient} text-white`}`}>
                  {isUser ? 'Eu' : professional.icon}
                </div>

                {/* Bubble */}
                <div className={`
                  p-4 rounded-2xl shadow-md text-sm md:text-base leading-relaxed
                  ${isUser 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}
                `}>
                  {isUser ? (
                    msg.text
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex justify-start w-full">
             <div className="flex items-end gap-2">
               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-gradient-to-br ${professional.gradient} text-white`}>
                  {professional.icon}
               </div>
               <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-700 flex space-x-1 items-center h-10">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-800 backdrop-blur-sm">
        <form 
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2 max-w-4xl mx-auto"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Converse com o especialista em ${professional.name}...`}
            className="w-full bg-slate-900 text-slate-200 placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none h-[52px] scrollbar-hide"
            rows={1}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`
              p-3 rounded-xl transition-all duration-200 flex items-center justify-center
              ${!inputValue.trim() || isTyping 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs text-slate-600 mt-2">
          Pressione Shift + Enter para quebrar linha
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
