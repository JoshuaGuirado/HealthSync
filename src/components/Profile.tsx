import React from 'react';
import { Mail, Phone, MapPin, Droplet, Calendar } from 'lucide-react';

export function Profile() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-700 text-3xl font-bold">
          LL
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-display font-bold text-gray-900">Leandro Lindo</h2>
          <p className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">Paciente Premium</p>
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 font-display">Informações Pessoais</h3>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              leandro@exemplo.com
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              (11) 98765-4321
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 text-gray-400" />
              15/04/1990 (36 anos)
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              São Paulo, SP
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 font-display">Dados Médicos</h3>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Droplet className="w-5 h-5 mr-3 text-red-400" />
              <span className="font-medium mr-2">Tipo Sanguíneo:</span> O+
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Alergias:</span> Penicilina, Amendoim
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Condições Crônicas:</span> Nenhuma relatada
            </div>
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Contato de Emergência:</span> Maria (Mãe) - (11) 91234-5678
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
