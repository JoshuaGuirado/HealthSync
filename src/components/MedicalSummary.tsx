import React, { useState } from 'react';
import { Exam } from '../types';
import { generateMedicalSummary } from '../services/geminiService';
import { FileText, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';

interface MedicalSummaryProps {
  exams: Exam[];
}

export function MedicalSummary({ exams }: MedicalSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (exams.length === 0) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateMedicalSummary(exams);
      setSummary(result);
    } catch (err) {
      setError('Erro ao gerar o resumo. Tente novamente.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Adicione exames para gerar um resumo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Elevator Pitch Médico</h3>
            <p className="text-sm text-gray-600">Resumo inteligente para sua próxima consulta</p>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : summary ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </>
          ) : (
            'Gerar Resumo'
          )}
        </button>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {!summary && !isGenerating && !error && (
          <div className="text-center py-8 text-gray-500">
            Clique em "Gerar Resumo" para criar uma síntese do seu histórico.
          </div>
        )}
        
        {isGenerating && !summary && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Analisando histórico médico...</p>
          </div>
        )}
        
        {summary && (
          <div className="prose prose-blue max-w-none prose-headings:font-semibold prose-a:text-blue-600">
            <Markdown>{summary}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
