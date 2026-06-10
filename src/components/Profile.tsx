import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Droplet, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  User, 
  ShieldAlert, 
  Activity, 
  Info 
} from 'lucide-react';

interface ProfileData {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  localizacao: string;
  tipoSanguineo: string;
  alergias: string;
  condicoesCronicas: string;
  contatoEmergencia: string;
}

interface ProfileProps {
  profile: ProfileData;
  onUpdateProfile: (updated: ProfileData) => void;
}

export function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Profile Header */}
      <div className="p-8 border-b border-slate-100 bg-gradient-premium-soft flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 justify-between">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="w-24 h-24 rounded-full bg-gradient-premium border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-display font-bold">
            {getInitials(formData.nome)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              {formData.nome}
            </h2>
            <span className="inline-block px-3 py-1 mt-2 text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full">
              Paciente Premium
            </span>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Perfil
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors active:scale-95"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md active:scale-95"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </button>
          </div>
        )}
      </div>
      
      {/* Profile Details Container */}
      <form onSubmit={handleSave} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Personal Information Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2.5 font-display flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-500" />
              Informações Pessoais
            </h3>
            
            <div className="space-y-4">
              {/* Name (editable only) */}
              {isEditing && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    required
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <Mail className="w-5 h-5 mr-3 text-slate-400" />
                    {formData.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Telefone de Contato</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    placeholder="(11) 98765-4321"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <Phone className="w-5 h-5 mr-3 text-slate-400" />
                    {formData.telefone}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Nascimento</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    placeholder="15/04/1990"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                    {formData.dataNascimento}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cidade / Estado</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                    {formData.localizacao}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Medical Data Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2.5 font-display flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-500" />
              Dados Médicos
            </h3>
            
            <div className="space-y-4">
              {/* Blood Type */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo Sanguíneo</label>
                {isEditing ? (
                  <select
                    value={formData.tipoSanguineo}
                    onChange={(e) => setFormData({ ...formData, tipoSanguineo: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="">Não informado</option>
                  </select>
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2 font-semibold">
                    <Droplet className="w-5 h-5 mr-3 text-red-500 shrink-0" />
                    {formData.tipoSanguineo || 'Não informado'}
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Alergias (separadas por vírgula)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.alergias}
                    onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    placeholder="Ex: Penicilina, Amendoim"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <ShieldAlert className="w-5 h-5 mr-3 text-amber-500 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {formData.alergias ? (
                        formData.alergias.split(',').map((alg, i) => (
                          <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                            {alg.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">Nenhuma relatada</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Condições Crônicas</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.condicoesCronicas}
                    onChange={(e) => setFormData({ ...formData, condicoesCronicas: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    placeholder="Ex: Hipertensão, Diabetes"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <Info className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                    {formData.condicoesCronicas || <span className="text-slate-500 italic">Nenhuma relatada</span>}
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Contato de Emergência</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contatoEmergencia}
                    onChange={(e) => setFormData({ ...formData, contatoEmergencia: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-sm font-semibold"
                    placeholder="Ex: Maria (Mãe) - (11) 91234-5678"
                  />
                ) : (
                  <div className="flex items-center text-slate-700 text-sm py-2">
                    <User className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                    {formData.contatoEmergencia || <span className="text-slate-500 italic">Nenhum cadastrado</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </form>
    </motion.div>
  );
}
