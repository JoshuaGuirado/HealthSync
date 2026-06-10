import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  FileText, 
  MessageSquare, 
  Stethoscope, 
  Syringe, 
  ClipboardList, 
  LogOut, 
  Bell, 
  User as UserIcon,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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
import { Dashboard } from './components/Dashboard';
import { mockExams, mockVaccines, mockEvents } from './mockData';

type Tab = 'dashboard' | 'exames' | 'historico' | 'vacinacao' | 'resumo' | 'assistente' | 'perfil' | 'notificacoes';

const DEFAULT_PROFILE = {
  nome: 'Leandro Lindo',
  email: 'leandro@exemplo.com',
  telefone: '(11) 98765-4321',
  dataNascimento: '15/04/1990',
  localizacao: 'São Paulo, SP',
  tipoSanguineo: 'O+',
  alergias: 'Penicilina, Amendoim',
  condicoesCronicas: 'Nenhuma relatada',
  contatoEmergencia: 'Maria (Mãe) - (11) 91234-5678'
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data states
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

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('health_sync_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
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

  useEffect(() => {
    localStorage.setItem('health_sync_profile', JSON.stringify(profile));
  }, [profile]);

  const handleExamAdded = (exam: Exam) => {
    setExams(prev => [...prev, exam]);
  };

  const handleRemoveExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  const handleUpdateProfile = (updatedProfile: typeof DEFAULT_PROFILE) => {
    setProfile(updatedProfile);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Painel Central', icon: Home },
    { id: 'exames', label: 'Meus Exames', icon: FileText },
    { id: 'historico', label: 'Histórico Clínico', icon: ClipboardList },
    { id: 'vacinacao', label: 'Vacinação', icon: Syringe },
    { id: 'resumo', label: 'Resumo IA', icon: Stethoscope },
    { id: 'assistente', label: 'Assistente IA', icon: MessageSquare },
    { id: 'perfil', label: 'Meu Perfil', icon: UserIcon },
    { id: 'notificacoes', label: 'Notificações', icon: Bell, count: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-slate-100 px-4 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="bg-gradient-premium p-1.5 rounded-xl text-white shadow-md shadow-indigo-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-lg font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
            Health Sync
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('notificacoes')}
            className={`p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors relative ${activeTab === 'notificacoes' ? 'bg-slate-100 text-indigo-600' : ''}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 sticky top-16 left-0 right-0 z-20 shadow-md overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 shrink-0" />
                    {item.label}
                  </div>
                  {item.count && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
              
              <div className="h-px bg-slate-100 my-2"></div>
              
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5 mr-3 shrink-0" />
                Sair da Conta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Panel */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-slate-200/80 bg-white sticky top-0 h-screen transition-all duration-300 z-30 shadow-sm shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-gradient-premium p-2 rounded-xl text-white shadow-lg shadow-indigo-500/15 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                Health Sync
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg border border-slate-150 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-xl transition-all group relative ${
                  isSelected 
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm shadow-indigo-500/5' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center min-w-0">
                  <item.icon className={`w-5 h-5 shrink-0 transition-colors ${
                    isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  {!sidebarCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                </div>
                
                {item.count && !sidebarCollapsed && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-sm shadow-rose-200">
                    {item.count}
                  </span>
                )}
                
                {/* Visual select indicators */}
                {isSelected && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div 
                onClick={() => setActiveTab('perfil')}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-premium text-white font-bold flex items-center justify-center shadow-md">
                  {profile.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {profile.nome}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Paciente</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-xl border border-transparent hover:border-rose-100"
                title="Sair da Conta"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sair da Conta"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen max-w-7xl mx-auto w-full">
        {/* Dynamic header title */}
        <div className="hidden lg:flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Painel de Controle'}
              {activeTab === 'exames' && 'Histórico Digital de Exames'}
              {activeTab === 'historico' && 'Linha do Tempo Clínica'}
              {activeTab === 'vacinacao' && 'Passaporte de Vacinas'}
              {activeTab === 'resumo' && 'Resumos e Laudos de IA'}
              {activeTab === 'assistente' && 'Conversar com IA'}
              {activeTab === 'perfil' && 'Gerenciamento de Conta'}
              {activeTab === 'notificacoes' && 'Alertas e Notificações'}
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Health Sync • Seu Prontuário Inteligente</p>
          </div>

          <div className="flex items-center space-x-3.5">
            <button 
              onClick={() => setActiveTab('notificacoes')}
              className={`p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all relative ${
                activeTab === 'notificacoes' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white'
              }`}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            <div 
              onClick={() => setActiveTab('perfil')}
              className="flex items-center space-x-3 bg-white border border-slate-200 hover:border-slate-300 shadow-sm pl-3 pr-4 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-xs">
                {profile.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800">{profile.nome}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Rendering with motion animations */}
        <div className="pb-16 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  exams={exams} 
                  vaccines={vaccines} 
                  medicalEvents={medicalEvents} 
                  onNavigate={setActiveTab}
                  profile={profile}
                />
              )}

              {activeTab === 'exames' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-base font-bold text-slate-800 font-display mb-4">Adicionar Novo Exame</h2>
                    <ExamUpload onExamAdded={handleExamAdded} />
                  </section>
                  
                  <section>
                    <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto">
                      <h2 className="text-base font-bold text-slate-800 font-display">Histórico de Laudos</h2>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                        {exams.length} exame(s)
                      </span>
                    </div>
                    <ExamList exams={exams} onRemoveExam={handleRemoveExam} />
                  </section>
                </div>
              )}

              {activeTab === 'historico' && (
                <MedicalHistory 
                  events={medicalEvents} 
                  onAddEvent={(e) => setMedicalEvents(prev => [...prev, e])}
                  onRemoveEvent={(id) => setMedicalEvents(prev => prev.filter(e => e.id !== id))}
                />
              )}

              {activeTab === 'vacinacao' && (
                <VaccinationCard 
                  vaccines={vaccines} 
                  onAddVaccine={(v) => setVaccines(prev => [...prev, v])}
                  onRemoveVaccine={(id) => setVaccines(prev => prev.filter(v => v.id !== id))}
                />
              )}

              {activeTab === 'resumo' && (
                <MedicalSummary exams={exams} />
              )}

              {activeTab === 'assistente' && (
                <ChatAssistant exams={exams} />
              )}

              {activeTab === 'perfil' && (
                <Profile 
                  profile={profile} 
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {activeTab === 'notificacoes' && (
                <Notifications />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden bg-white border-t border-slate-200/80 fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {[
          { id: 'dashboard', label: 'Painel', icon: Home },
          { id: 'exames', label: 'Exames', icon: FileText },
          { id: 'historico', label: 'Linha Tempo', icon: ClipboardList },
          { id: 'vacinacao', label: 'Vacinas', icon: Syringe },
          { id: 'assistente', label: 'IA Chat', icon: MessageSquare }
        ].map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold transition-all ${
                isSelected ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <item.icon className={`w-5.5 h-5.5 mb-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
}
