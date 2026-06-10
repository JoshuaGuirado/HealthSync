import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  FileText, 
  Syringe, 
  ClipboardList, 
  Plus, 
  Sparkles, 
  User, 
  Droplet, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Exam, Vaccine, MedicalEvent } from '../types';

interface DashboardProps {
  exams: Exam[];
  vaccines: Vaccine[];
  medicalEvents: MedicalEvent[];
  onNavigate: (tab: 'exames' | 'historico' | 'vacinacao' | 'resumo' | 'assistente' | 'perfil' | 'notificacoes') => void;
  profile: {
    nome: string;
    tipoSanguineo: string;
    alergias: string;
    contatoEmergencia: string;
  };
}

export function Dashboard({ exams, vaccines, medicalEvents, onNavigate, profile }: DashboardProps) {
  // Combine all activities for a unified timeline
  const examActivities = exams.map(e => ({
    id: e.id,
    type: 'exam' as const,
    title: e.exame,
    subtitle: e.laboratorio || 'Laboratório não informado',
    date: new Date(e.data),
    meta: `${e.resultados.length} parâmetros`
  }));

  const vaccineActivities = vaccines.map(v => ({
    id: v.id,
    type: 'vaccine' as const,
    title: v.nome,
    subtitle: v.dose,
    date: new Date(v.data),
    meta: v.local || 'UBS'
  }));

  const eventActivities = medicalEvents.map(ev => ({
    id: ev.id,
    type: 'event' as const,
    title: ev.descricao,
    subtitle: ev.tipo,
    date: new Date(ev.data),
    meta: ev.medicoLocal || 'Clínica'
  }));

  // Sort activities chronologically (newest first) and take the last 4
  const allActivities = [
    ...examActivities,
    ...vaccineActivities,
    ...eventActivities
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
   .slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero Header Card */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-premium p-8 text-white shadow-xl shadow-indigo-500/10"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-pink-200 animate-pulse" />
              Prontuário Inteligente Ativo
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
              Olá, {profile.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 max-w-xl text-base leading-relaxed">
              Todos os seus exames, carteira de vacinas e histórico clínico reunidos em uma experiência segura orientada por Inteligência Artificial.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate('assistente')}
            className="shrink-0 flex items-center px-6 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 transition-all font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Falar com Assistente IA
            <ArrowRight className="ml-2 w-4.5 h-4.5" />
          </button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Exames Salvos', 
            val: exams.length, 
            desc: 'Laudos analisados', 
            icon: FileText, 
            color: 'from-blue-500 to-cyan-500', 
            tab: 'exames' as const 
          },
          { 
            label: 'Imunizações', 
            val: vaccines.length, 
            desc: 'Doses aplicadas', 
            icon: Syringe, 
            color: 'from-emerald-500 to-teal-500', 
            tab: 'vacinacao' as const 
          },
          { 
            label: 'Histórico Clínico', 
            val: medicalEvents.length, 
            desc: 'Eventos na linha do tempo', 
            icon: ClipboardList, 
            color: 'from-purple-500 to-indigo-500', 
            tab: 'historico' as const 
          },
          { 
            label: 'Alergias Relatadas', 
            val: profile.alergias ? profile.alergias.split(',').length : 0, 
            desc: 'Fatores de risco', 
            icon: ShieldAlert, 
            color: 'from-rose-500 to-pink-500', 
            tab: 'perfil' as const 
          },
        ].map((met, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(met.tab)}
            className="glass-card hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${met.color} text-white`}>
                <met.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                Ver <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 font-display block tracking-tight">
                {met.val}
              </span>
              <span className="text-sm font-semibold text-slate-800 block mt-1">
                {met.label}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                {met.desc}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Grid: Info + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Health Indicators & Shortcuts */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Health Indicators Box */}
          <div className="glass-card p-6 rounded-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-500" />
              Indicadores de Saúde
            </h3>
            
            <div className="space-y-4">
              {/* Blood Type */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Tipo Sanguíneo</span>
                </div>
                <span className="text-lg font-bold text-slate-950">{profile.tipoSanguineo || 'N/A'}</span>
              </div>

              {/* Emergency Contact */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Emergência</span>
                </div>
                <span className="text-xs font-bold text-slate-950 truncate max-w-[150px] text-right">
                  {profile.contatoEmergencia || 'Nenhum'}
                </span>
              </div>

              {/* Risks */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Alergias</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.alergias ? (
                    profile.alergias.split(',').map((alg, i) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {alg.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Nenhuma relatada</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">Atalhos de Acesso</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('exames')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors text-center"
              >
                <Plus className="w-6 h-6 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-slate-700">Subir Exame</span>
              </button>
              <button 
                onClick={() => onNavigate('resumo')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-colors text-center"
              >
                <Sparkles className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-xs font-bold text-slate-700">Resumo de IA</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Unified Activity Timeline */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                    Atividades Recentes
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Últimos eventos adicionados ao seu prontuário</p>
                </div>
                
                <button 
                  onClick={() => onNavigate('historico')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  Ver Tudo
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              {allActivities.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                  <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-500">Nenhuma atividade registrada.</p>
                  <p className="text-xs text-slate-400 mt-1">Carregue exames ou registre vacinas para ver os dados unificados aqui.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allActivities.map((act, index) => {
                    let Icon = FileText;
                    let colorClass = 'bg-blue-100 text-blue-600 border-blue-200';
                    let badgeLabel = 'Exame';
                    let tabName: 'exames' | 'historico' | 'vacinacao' = 'exames';

                    if (act.type === 'vaccine') {
                      Icon = Syringe;
                      colorClass = 'bg-emerald-100 text-emerald-600 border-emerald-200';
                      badgeLabel = 'Vacina';
                      tabName = 'vacinacao';
                    } else if (act.type === 'event') {
                      Icon = ClipboardList;
                      colorClass = 'bg-purple-100 text-purple-600 border-purple-200';
                      badgeLabel = act.subtitle;
                      tabName = 'historico';
                    }

                    return (
                      <div 
                        key={act.id}
                        onClick={() => onNavigate(tabName)}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl border ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-500 mb-1">
                              {badgeLabel}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {act.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{act.subtitle}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-500">
                            {act.date.toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{act.meta}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {allActivities.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-premium-soft border border-indigo-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">IA Pronta para Consulta</h4>
                    <p className="text-[10px] text-slate-500">Gere um resumo executivo para entregar ao seu médico.</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('resumo')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Gerar Resumo
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
