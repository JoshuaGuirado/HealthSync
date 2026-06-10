import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalEvent } from '../types';
import { 
  ClipboardList, 
  Calendar, 
  Building2, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Stethoscope, 
  Scissors, 
  Flame, 
  HeartPulse, 
  Clock, 
  Check, 
  X, 
  Search 
} from 'lucide-react';

interface MedicalHistoryProps {
  events: MedicalEvent[];
  onAddEvent: (event: MedicalEvent) => void;
  onRemoveEvent: (id: string) => void;
}

export function MedicalHistory({ events, onAddEvent, onRemoveEvent }: MedicalHistoryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState<{
    data: string;
    tipo: MedicalEvent['tipo'];
    descricao: string;
    medicoLocal: string;
  }>({
    data: '',
    tipo: 'Consulta',
    descricao: '',
    medicoLocal: ''
  });
  const [documentUrl, setDocumentUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setDocumentUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data || !formData.descricao) return;

    onAddEvent({
      id: crypto.randomUUID(),
      data: formData.data,
      tipo: formData.tipo,
      descricao: formData.descricao,
      medicoLocal: formData.medicoLocal,
      documentUrl: documentUrl
    });

    setFormData({ data: '', tipo: 'Consulta', descricao: '', medicoLocal: '' });
    setDocumentUrl(undefined);
    setIsAdding(false);
  };

  const sortedEvents = [...events].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const filteredEvents = sortedEvents.filter(event => {
    const matchesSearch = event.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (event.medicoLocal && event.medicoLocal.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || event.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  const getEventStyle = (tipo: MedicalEvent['tipo']) => {
    switch (tipo) {
      case 'Cirurgia': 
        return {
          icon: Scissors,
          color: 'text-rose-600 bg-rose-50 border-rose-100',
          dot: 'bg-rose-500 ring-rose-100'
        };
      case 'Internação': 
        return {
          icon: Flame,
          color: 'text-amber-600 bg-amber-50 border-amber-100',
          dot: 'bg-amber-500 ring-amber-100'
        };
      case 'Condição Crônica': 
        return {
          icon: HeartPulse,
          color: 'text-purple-600 bg-purple-50 border-purple-100',
          dot: 'bg-purple-500 ring-purple-100'
        };
      case 'Consulta': 
        return {
          icon: Stethoscope,
          color: 'text-blue-600 bg-blue-50 border-blue-100',
          dot: 'bg-blue-500 ring-blue-100'
        };
      default: 
        return {
          icon: ClipboardList,
          color: 'text-slate-600 bg-slate-50 border-slate-100',
          dot: 'bg-slate-500 ring-slate-100'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-500" />
            Histórico Clínico
          </h2>
          <p className="text-sm text-slate-500">Linha do tempo integrada de consultas, cirurgias e diagnósticos</p>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4.5 h-4.5 mr-2" />
            Novo Evento
          </button>
        )}
      </div>

      {/* Form modal container */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-950 font-display">Adicionar Evento Clínico</h3>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Data do Evento *</label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={e => setFormData({...formData, data: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tipo de Evento *</label>
                <select
                  value={formData.tipo}
                  onChange={e => setFormData({...formData, tipo: e.target.value as MedicalEvent['tipo']})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="Consulta">Consulta</option>
                  <option value="Cirurgia">Cirurgia</option>
                  <option value="Internação">Internação</option>
                  <option value="Condição Crônica">Condição Crônica / Diagnóstico</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Descrição / Diagnóstico *</label>
                <input
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={e => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Ex: Remoção de vesícula, Check-up anual, Diagnóstico de asma..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Médico ou Hospital (Opcional)</label>
                <input
                  type="text"
                  value={formData.medicoLocal}
                  onChange={e => setFormData({...formData, medicoLocal: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Ex: Dr. Roberto Costa, Hospital Albert Einstein"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Anexar Laudo / Receita (Opcional)</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 bg-white transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2 text-slate-500" />
                    {documentUrl ? 'Trocar Arquivo' : 'Anexar Documento'}
                  </button>
                  {documentUrl && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Anexo carregado
                    </span>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
              >
                Salvar Evento
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search & Filter bar */}
      {events.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs flex items-center">
            <Search className="w-4.5 h-4.5 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold text-slate-700 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'Consulta', label: 'Consultas' },
              { id: 'Cirurgia', label: 'Cirurgias' },
              { id: 'Internação', label: 'Internações' },
              { id: 'Condição Crônica', label: 'Diagnósticos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  filterType === tab.id
                    ? 'bg-blue-50 border-blue-205 text-blue-700'
                    : 'bg-white border-slate-105 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed max-w-2xl mx-auto shadow-sm">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold font-display">Nenhum evento registrado</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            {searchTerm ? 'Tente ajustar sua pesquisa.' : 'Adicione consultas relevantes, cirurgias ou histórico de saúde.'}
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-5 md:ml-8 space-y-6 py-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => {
              const style = getEventStyle(event.tipo);
              const EventIcon = style.icon;

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={event.id} 
                  className="relative pl-6 md:pl-8 group"
                >
                  {/* Timeline Node Ring */}
                  <div className={`absolute -left-[11px] top-2.5 w-5 h-5 rounded-full bg-white border-4 ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${style.dot}`} />
                  
                  {/* Event Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start space-x-4">
                        {/* Custom visual indicator */}
                        <div className={`p-3 rounded-xl border shrink-0 ${style.color}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${style.color}`}>
                              {event.tipo}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 flex items-center bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {new Date(event.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 font-display">
                            {event.descricao}
                          </h3>

                          {event.medicoLocal && (
                            <div className="text-xs font-medium text-slate-500 flex items-center">
                              <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                              {event.medicoLocal}
                            </div>
                          )}

                          {event.documentUrl && (
                            <div className="pt-2">
                              <a 
                                href={event.documentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Download className="w-3.5 h-3.5 mr-1" />
                                Visualizar Anexo
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveEvent(event.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 self-start"
                        title="Remover evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
