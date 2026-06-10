import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vaccine } from '../types';
import { 
  Syringe, 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Check, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface VaccinationCardProps {
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Vaccine) => void;
  onRemoveVaccine: (id: string) => void;
}

export function VaccinationCard({ vaccines, onAddVaccine, onRemoveVaccine }: VaccinationCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    dose: '',
    lote: '',
    local: ''
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
    if (!formData.nome || !formData.data || !formData.dose) return;

    onAddVaccine({
      id: crypto.randomUUID(),
      nome: formData.nome,
      data: formData.data,
      dose: formData.dose,
      lote: formData.lote,
      local: formData.local,
      documentUrl: documentUrl
    });

    setFormData({ nome: '', data: '', dose: '', lote: '', local: '' });
    setDocumentUrl(undefined);
    setIsAdding(false);
  };

  const sortedVaccines = [...vaccines].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const filteredVaccines = sortedVaccines.filter(v => 
    v.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.local && v.local.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-emerald-500 animate-pulse" />
            Carteira Digital de Vacinação
          </h2>
          <p className="text-sm text-slate-500">Histórico digital e comprovantes de imunizações</p>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4.5 h-4.5 mr-2" />
            Nova Vacina
          </button>
        )}
      </div>

      {/* Add Form Container */}
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
              <h3 className="text-base font-bold text-slate-950 font-display">Registrar Nova Vacina</h3>
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nome da Vacina *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Ex: COVID-19, Influenza, Antitetânica"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Data da Aplicação *</label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={e => setFormData({...formData, data: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Dose *</label>
                <input
                  type="text"
                  required
                  value={formData.dose}
                  onChange={e => setFormData({...formData, dose: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Ex: 1ª Dose, Reforço, Dose Única"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Lote (Opcional)</label>
                <input
                  type="text"
                  value={formData.lote}
                  onChange={e => setFormData({...formData, lote: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Número do lote"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Local de Aplicação (Opcional)</label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={e => setFormData({...formData, local: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Ex: UBS Centro, Clínica Imunizar, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Comprovante de Vacinação (Opcional)</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 bg-white transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2 text-slate-500" />
                    {documentUrl ? 'Trocar Arquivo' : 'Anexar Imagem ou PDF'}
                  </button>
                  {documentUrl && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 animate-fade-in">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Documento anexado
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
                Salvar Vacina
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search Input */}
      {vaccines.length > 0 && (
        <div className="relative w-full bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-6 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar vacinas na carteira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-semibold text-slate-700 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>
      )}

      {/* Vaccines Passport Grid */}
      {filteredVaccines.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed max-w-2xl mx-auto shadow-sm">
          <Syringe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold font-display">Nenhuma vacina encontrada</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            {searchTerm ? 'Tente ajustar sua pesquisa.' : 'Adicione suas vacinas e mantenha sua proteção em dia.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVaccines.map(vaccine => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={vaccine.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Decorative Passport Stamp effect */}
              <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full border-[8px] border-emerald-500/5 flex items-center justify-center rotate-12 pointer-events-none group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-10 h-10 text-emerald-500/5" />
              </div>
              
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">{vaccine.nome}</h3>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md">
                      Imunizado
                    </span>
                  </div>
                  <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 border border-blue-100 text-blue-600 shadow-sm shadow-blue-100/50">
                    {vaccine.dose}
                  </span>
                </div>
                
                <div className="mt-5 space-y-2.5 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
                    <span>Data: {new Date(vaccine.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {vaccine.local && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span className="truncate max-w-[220px]">Local: {vaccine.local}</span>
                    </div>
                  )}
                  {vaccine.lote && (
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2.5 text-slate-400 font-mono text-[11px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded">#</span>
                      <span>Lote: {vaccine.lote}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                {vaccine.documentUrl ? (
                  <a 
                    href={vaccine.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Comprovante
                  </a>
                ) : (
                  <div />
                )}
                
                <button
                  onClick={() => onRemoveVaccine(vaccine.id)}
                  className="text-slate-400 hover:text-rose-600 flex items-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
