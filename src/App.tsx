/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, FileText, MessageSquare, Stethoscope, Syringe, ClipboardList, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { Exam, Vaccine, MedicalEvent } from './types';
import { ExamUpload } from './components/ExamUpload';
import { ExamList } from './components/ExamList';
import { MedicalSummary } from './components/MedicalSummary';
import { ChatAssistant } from './components/ChatAssistant';
import { VaccinationCard } from './components/VaccinationCard';
import { MedicalHistory } from './components/MedicalHistory';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';
import { mockExams, mockVaccines, mockEvents } from './mockData';

type Tab = 'exames' | 'historico' | 'vacinacao' | 'resumo' | 'assistente' | 'perfil' | 'notificacoes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('exames');
  
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('health_sync_exams');
    return saved ? JSON.parse(saved) : mockExams;
  });
  
  const [vaccines, setVaccines] = useState<Vaccine[]>(() => {
    const saved = localStorage.getItem('health_sync_vaccines');
    return saved ? JSON.parse(saved) : mockVaccines;
  });
  
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>(() => {
    const saved = localStorage.getItem('health_sync_events');
    return saved ? JSON.parse(saved) : mockEvents;
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('health_sync_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('health_sync_vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem('health_sync_events', JSON.stringify(medicalEvents));
  }, [medicalEvents]);

  const handleExamAdded = (exam: Exam) => {
    setExams(prev => [...prev, exam]);
  };

  const handleRemoveExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Health Sync
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              MVP Prototype
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('notificacoes')}
              className={`p-2 transition-colors relative rounded-full ${activeTab === 'notificacoes' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Leandro Lindo</p>
                <p className="text-xs text-gray-500">Paciente</p>
              </div>
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border flex items-center justify-center text-blue-700 font-medium transition-all ${activeTab === 'perfil' ? 'border-blue-400 ring-2 ring-blue-100' : 'border-blue-200 hover:border-blue-300'}`}
                title="Meu Perfil"
              >
                LL
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Olá, Leandro! 👋</h1>
          <p className="text-gray-500 mt-1">Seu histórico médico está atualizado. O que vamos fazer hoje?</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl mb-8 w-fit shadow-sm border border-gray-100">
          {[
            { id: 'exames', label: 'Meus Exames', icon: FileText },
            { id: 'historico', label: 'Histórico Médico', icon: ClipboardList },
            { id: 'vacinacao', label: 'Vacinas', icon: Syringe },
            { id: 'resumo', label: 'Resumo IA', icon: Stethoscope },
            { id: 'assistente', label: 'Assistente', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'exames' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-lg font-semibold mb-4 font-display">Adicionar Novo Exame</h2>
                <ExamUpload onExamAdded={handleExamAdded} />
              </section>
              
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold font-display">Histórico Digitalizado</h2>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {exams.length} exame(s)
                  </span>
                </div>
                <ExamList exams={exams} onRemoveExam={handleRemoveExam} />
              </section>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MedicalHistory 
                events={medicalEvents} 
                onAddEvent={(e) => setMedicalEvents(prev => [...prev, e])}
                onRemoveEvent={(id) => setMedicalEvents(prev => prev.filter(e => e.id !== id))}
              />
            </div>
          )}

          {activeTab === 'vacinacao' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <VaccinationCard 
                vaccines={vaccines} 
                onAddVaccine={(v) => setVaccines(prev => [...prev, v])}
                onRemoveVaccine={(id) => setVaccines(prev => prev.filter(v => v.id !== id))}
              />
            </div>
          )}

          {activeTab === 'resumo' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MedicalSummary exams={exams} />
            </div>
          )}

          {activeTab === 'assistente' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ChatAssistant exams={exams} />
            </div>
          )}

          {activeTab === 'perfil' && (
            <Profile />
          )}

          {activeTab === 'notificacoes' && (
            <Notifications />
          )}
        </div>
      </main>
    </div>
  );
}
