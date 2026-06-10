import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exam, ChatMessage } from '../types';
import { askMedicalRecord } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatAssistantProps {
  exams: Exam[];
}

export function ChatAssistant({ exams }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou seu assistente de saúde Health Sync. Posso analisar todos os exames estruturados no seu prontuário. O que você gostaria de saber hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'Resuma meus exames em tópicos rápidos.', label: 'Resumir exames' },
    { text: 'Existem valores alterados ou fora do padrão de referência?', label: 'Checar alterações' },
    { text: 'Quais tendências você observa no meu histórico de exames?', label: 'Analisar tendências' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || exams.length === 0) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: textToSend.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await askMedicalRecord(exams, userMsg.text, history);
      
      const modelMsg: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        role: 'model', 
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Verifique se o arquivo está legível ou se a sua GEMINI_API_KEY está configurada no Vercel.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
        <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-bold font-display">Chat do Assistente Clínico</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          Adicione seus exames no painel principal para que a Inteligência Artificial possa analisá-los e responder suas dúvidas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden max-w-4xl mx-auto">
      {/* Assistant Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-premium-soft flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center">
              Assistente Health Sync
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-100 text-indigo-700">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 animate-spin-slow" />
                Gemini AI
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Tire dúvidas clínicas baseadas nos seus exames salvos</p>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/20">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar Icon */}
                <div className={`shrink-0 w-8.5 h-8.5 rounded-xl border flex items-center justify-center shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-premium border-indigo-400 ml-3 text-white' 
                    : 'bg-white border-slate-200 mr-3 text-indigo-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
                </div>
                
                {/* Bubble Container */}
                <div className={`px-4.5 py-3.5 rounded-2xl shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none prose prose-indigo max-w-none prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-headings:font-display prose-strong:text-indigo-900 prose-ul:list-disc'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm font-semibold">{msg.text}</p>
                  ) : (
                    <Markdown>{msg.text}</Markdown>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* AI Loader */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex flex-row max-w-[75%]">
                <div className="shrink-0 w-8.5 h-8.5 rounded-xl border bg-white border-slate-200 mr-3 text-indigo-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 text-slate-500 rounded-tl-none flex items-center space-x-2.5 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span className="text-xs font-bold text-slate-500 animate-pulse">Analisando prontuário médico...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Area with suggestions and input form */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-4">
        {/* Quick Prompts Suggestions */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Sugestões de perguntas
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 hover:border-indigo-200 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Sparkles className="w-3 h-3 mr-1.5 text-indigo-400" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search input form */}
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Como está meu colesterol comparado com a referência?"
            className="flex-1 px-4.5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-semibold text-slate-700 bg-slate-50/50 focus:bg-white transition-all placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
