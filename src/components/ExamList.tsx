import React from 'react';
import { Exam } from '../types';
import { FileText, AlertTriangle, Calendar, Building2, Trash2 } from 'lucide-react';

interface ExamListProps {
  exams: Exam[];
  onRemoveExam: (id: string) => void;
}

export function ExamList({ exams, onRemoveExam }: ExamListProps) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Nenhum exame digitalizado ainda.</p>
        <p className="text-sm text-gray-400 mt-1">Faça o upload do seu primeiro exame para começar.</p>
      </div>
    );
  }

  // Sort exams by date descending
  const sortedExams = [...exams].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="space-y-6">
      {sortedExams.map((exam) => (
        <div key={exam.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{exam.exame}</h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(exam.data).toLocaleDateString('pt-BR')}
                </div>
                {exam.laboratorio && (
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5" />
                    {exam.laboratorio}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {exam.originalFileUrl && (
                <a 
                  href={exam.originalFileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  Ver Original
                </a>
              )}
              <button
                onClick={() => onRemoveExam(exam.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                title="Remover exame"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Parâmetro</th>
                    <th className="px-4 py-3 font-medium">Resultado</th>
                    <th className="px-4 py-3 font-medium">Referência</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exam.resultados.map((res, idx) => (
                    <tr key={idx} className={res.alterado ? 'bg-red-50/30' : ''}>
                      <td className="px-4 py-3 font-medium text-gray-900">{res.parametro}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${res.alterado ? 'text-red-600' : 'text-gray-900'}`}>
                          {res.valor}
                        </span>
                        {res.unidade && <span className="text-gray-500 ml-1 text-xs">{res.unidade}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{res.referencia || '-'}</td>
                      <td className="px-4 py-3">
                        {res.alterado ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alterado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
