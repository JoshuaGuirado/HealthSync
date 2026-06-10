import React, { useState, useRef } from 'react';
import { MedicalEvent } from '../types';
import { ClipboardList, Calendar, Building2, Plus, Trash2, Activity, Download, Upload } from 'lucide-react';

interface MedicalHistoryProps {
  events: MedicalEvent[];
  onAddEvent: (event: MedicalEvent) => void;
  onRemoveEvent: (id: string) => void;
}

export function MedicalHistory({ events, onAddEvent, onRemoveEvent }: MedicalHistoryProps) {
  const [isAdding, setIsAdding] = useState(false);
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

  const getTypeColor = (tipo: MedicalEvent['tipo']) => {
    switch (tipo) {
      case 'Cirurgia': return 'bg-red-100 text-red-800';
      case 'Internação': return 'bg-orange-100 text-orange-800';
      case 'Condição Crônica': return 'bg-purple-100 text-purple-800';
      case 'Consulta': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Histórico Médico</h2>
          <p className="text-sm text-gray-500">Linha do tempo de eventos de saúde</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={e => setFormData({...formData, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento *</label>
              <select
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value as MedicalEvent['tipo']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="Consulta">Consulta</option>
                <option value="Cirurgia">Cirurgia</option>
                <option value="Internação">Internação</option>
                <option value="Condição Crônica">Condição Crônica / Diagnóstico</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                type="text"
                required
                value={formData.descricao}
                onChange={e => setFormData({...formData, descricao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: Cirurgia de apêndice, Diagnóstico de hipertensão..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Médico ou Local (Opcional)</label>
              <input
                type="text"
                value={formData.medicoLocal}
                onChange={e => setFormData({...formData, medicoLocal: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: Dr. Silva, Hospital São Lucas"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Documento (Opcional)</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {documentUrl ? 'Trocar Documento' : 'Anexar Documento'}
                </button>
                {documentUrl && <span className="text-sm text-green-600 font-medium">Documento anexado com sucesso!</span>}
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
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Evento
            </button>
          </div>
        </form>
      )}

      {events.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum evento médico registrado.</p>
          <p className="text-sm text-gray-400 mt-1">Adicione cirurgias, diagnósticos ou consultas importantes.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-8 py-4">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-6 md:pl-8 group">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(event.tipo)}`}>
                        {event.tipo}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{event.descricao}</h3>
                    {event.medicoLocal && (
                      <div className="mt-2 text-sm text-gray-600 flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        {event.medicoLocal}
                      </div>
                    )}
                    
                    {event.documentUrl && (
                      <div className="mt-4">
                        <a 
                          href={event.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1.5" />
                          Ver Documento
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveEvent(event.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 self-start"
                    title="Remover evento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
