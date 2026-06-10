import React, { useState, useRef } from 'react';
import { Vaccine } from '../types';
import { Syringe, Calendar, MapPin, Plus, Trash2, Download, Upload } from 'lucide-react';

interface VaccinationCardProps {
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Vaccine) => void;
  onRemoveVaccine: (id: string) => void;
}

export function VaccinationCard({ vaccines, onAddVaccine, onRemoveVaccine }: VaccinationCardProps) {
  const [isAdding, setIsAdding] = useState(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Carteira de Vacinação</h2>
          <p className="text-sm text-gray-500">Acompanhe suas imunizações</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Vacina
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Vacina *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: COVID-19, Influenza, Tétano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Aplicação *</label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={e => setFormData({...formData, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dose *</label>
              <input
                type="text"
                required
                value={formData.dose}
                onChange={e => setFormData({...formData, dose: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: 1ª Dose, Reforço, Única"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lote (Opcional)</label>
              <input
                type="text"
                value={formData.lote}
                onChange={e => setFormData({...formData, lote: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Número do lote"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Local de Aplicação (Opcional)</label>
              <input
                type="text"
                value={formData.local}
                onChange={e => setFormData({...formData, local: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: UBS Centro, Clínica Imunizar"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comprovante (Opcional)</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {documentUrl ? 'Trocar Imagem' : 'Anexar Imagem'}
                </button>
                {documentUrl && <span className="text-sm text-green-600 font-medium">Imagem anexada com sucesso!</span>}
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
              Salvar Vacina
            </button>
          </div>
        </form>
      )}

      {vaccines.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma vacina registrada.</p>
          <p className="text-sm text-gray-400 mt-1">Adicione suas vacinas para manter o controle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedVaccines.map(vaccine => (
            <div key={vaccine.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{vaccine.nome}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {vaccine.dose}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(vaccine.data).toLocaleDateString('pt-BR')}
                  </div>
                  {vaccine.local && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {vaccine.local}
                    </div>
                  )}
                  {vaccine.lote && (
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-gray-400 font-mono text-xs flex items-center justify-center">#</span>
                      Lote: {vaccine.lote}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                {vaccine.documentUrl ? (
                  <a 
                    href={vaccine.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Ver Comprovante
                  </a>
                ) : (
                  <div></div>
                )}
                <button
                  onClick={() => onRemoveVaccine(vaccine.id)}
                  className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
