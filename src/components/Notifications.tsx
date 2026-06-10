import React from 'react';
import { Bell, FileText, Syringe, Calendar, CheckCircle2 } from 'lucide-react';

export function Notifications() {
  const notifications = [
    { 
      id: 1, 
      title: 'Novo exame processado', 
      desc: 'Seu Hemograma Completo e Perfil Lipídico foi analisado pela IA.', 
      time: 'Há 2 horas', 
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      unread: true
    },
    { 
      id: 2, 
      title: 'Lembrete de Vacina', 
      desc: 'Sua dose de reforço da Influenza está próxima. Agende no posto mais próximo.', 
      time: 'Ontem', 
      icon: Syringe, 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      unread: true
    },
    { 
      id: 3, 
      title: 'Consulta Agendada', 
      desc: 'Retorno com Dr. Roberto Costa amanhã às 14h.', 
      time: 'Há 2 dias', 
      icon: Calendar, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      unread: false
    },
    { 
      id: 4, 
      title: 'Perfil Atualizado', 
      desc: 'Suas informações de contato foram atualizadas com sucesso.', 
      time: 'Há 1 semana', 
      icon: CheckCircle2, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100',
      unread: false
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display">Notificações</h3>
            <p className="text-xs text-gray-500">Fique por dentro da sua saúde</p>
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Marcar todas como lidas
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4 relative ${notif.unread ? 'bg-blue-50/30' : ''}`}
          >
            {notif.unread && (
              <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            )}
            <div className={`p-3 rounded-xl ${notif.bg} ${notif.color} shrink-0`}>
              <notif.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900">{notif.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
              <span className="text-xs text-gray-400 mt-2 block font-medium">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
