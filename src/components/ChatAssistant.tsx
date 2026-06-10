import React, { useState, useRef, useEffect } from 'react';
import { Exam, ChatMessage } from '../types';
import { askMedicalRecord } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatAssistantProps {
  exams: Exam[];
}

export function ChatAssistant({ exams }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou seu assistente de saúde. Posso responder perguntas sobre os exames que você adicionou. O que você gostaria de saber?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || exams.length === 0) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the API
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await askMedicalRecord(exams, userMsg.text, history);
      
      const modelMsg: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        role: 'model', 
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Adicione exames para conversar com o assistente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center space-x-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assistente Health Sync</h3>
          <p className="text-xs text-gray-500">Pergunte sobre o seu histórico médico</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-indigo-100 mr-3'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none prose prose-sm max-w-none prose-p:leading-relaxed'
              }`}>
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
                ) : (
                  <Markdown>{msg.text}</Markdown>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 mr-3 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Analisando prontuário...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Qual foi o resultado do meu colesterol?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
