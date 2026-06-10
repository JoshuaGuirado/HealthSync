import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exam } from '../types';
import { 
  FileText, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  Trash2, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';

interface ExamListProps {
  exams: Exam[];
  onRemoveExam: (id: string) => void;
}

export function ExamList({ exams, onRemoveExam }: ExamListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'altered'>('all');
  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedExams(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed max-w-2xl mx-auto shadow-sm">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-bold font-display">Nenhum exame digitalizado ainda</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          Faça o upload do seu primeiro laudo para começar a estruturar seu histórico.
        </p>
      </div>
    );
  }

  // Filter & Search logic
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.exame.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (exam.laboratorio && exam.laboratorio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const hasAltered = exam.resultados.some(res => res.alterado);
    const matchesFilter = filterType === 'all' || (filterType === 'altered' && hasAltered);

    return matchesSearch && matchesFilter;
  });

  // Sort by date descending
  const sortedExams = [...filteredExams].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por exame ou laboratório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-semibold text-slate-700 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos os Exames
          </button>
          <button
            onClick={() => setFilterType('altered')}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              filterType === 'altered'
                ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Apenas Alterados
          </button>
        </div>
      </div>

      {/* Exame Cards */}
      <AnimatePresence mode="popLayout">
        {sortedExams.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-3xl border border-slate-100"
          >
            <p className="text-slate-400 text-sm font-semibold">Nenhum exame corresponde à sua busca.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedExams.map((exam) => {
              const isExpanded = !!expandedExams[exam.id];
              const hasAlteredResults = exam.resultados.some(res => res.alterado);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={exam.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden group ${
                    isExpanded 
                      ? 'border-indigo-200 ring-2 ring-indigo-50/50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header (Collapsible toggle) */}
                  <div 
                    onClick={() => toggleExpand(exam.id)}
                    className="px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2.5">
                        <h3 className="text-base font-bold text-slate-900 truncate font-display">
                          {exam.exame}
                        </h3>
                        {hasAlteredResults && (
                          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alterações
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1.5 text-xs text-slate-500 font-semibold">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {new Date(exam.data).toLocaleDateString('pt-BR')}
                        </div>
                        {exam.laboratorio && (
                          <div className="flex items-center truncate max-w-[150px] sm:max-w-xs">
                            <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {exam.laboratorio}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                      {exam.originalFileUrl && (
                        <a 
                          href={exam.originalFileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hidden sm:inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Ver Original
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                      
                      <button
                        onClick={() => onRemoveExam(exam.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                        title="Remover exame"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <div className="p-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Card Content (Table) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-100 bg-slate-50/20"
                      >
                        <div className="p-6 overflow-x-auto">
                          {/* Mobile visual check */}
                          <div className="block sm:hidden space-y-4 mb-4">
                            {exam.originalFileUrl && (
                              <a 
                                href={exam.originalFileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg w-full justify-center"
                              >
                                Ver Arquivo Original
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                          
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Parâmetro</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Resultado</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Referência</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 font-display text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {exam.resultados.map((res, idx) => (
                                <tr 
                                  key={idx} 
                                  className={`transition-colors ${res.alterado ? 'bg-rose-50/25 hover:bg-rose-50/45' : 'hover:bg-slate-50/50'}`}
                                >
                                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{res.parametro}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`font-extrabold ${res.alterado ? 'text-rose-600' : 'text-slate-900'}`}>
                                      {res.valor}
                                    </span>
                                    {res.unidade && <span className="text-slate-500 ml-1 text-xs font-medium">{res.unidade}</span>}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-500 font-semibold">{res.referencia || '-'}</td>
                                  <td className="px-4 py-3 text-right">
                                    {res.alterado ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                                        Alterado
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        Normal
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
