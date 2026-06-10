import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exam } from '../types';
import { generateMedicalSummary } from '../services/geminiService';
import { FileText, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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
      setError('Erro ao gerar o resumo com a IA. Certifique-se de que a sua GEMINI_API_KEY está configurada nas variáveis de ambiente da Vercel.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed max-w-2xl mx-auto shadow-sm">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-bold font-display">Resumo de Prontuário</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          Adicione seus exames na seção "Meus Exames" para gerar um resumo executivo inteligente para o seu médico.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto"
    >
      {/* Header Info */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-premium-soft flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Elevator Pitch Médico</h3>
            <p className="text-xs text-slate-500 font-semibold">Resumo clínico cronológico gerado por IA para sua consulta</p>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sintetizando...
            </>
          ) : summary ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Atualizar Resumo
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Gerar Resumo IA
            </>
          )}
        </button>
      </div>
      
      {/* Body Area */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start space-x-3 text-sm mb-6"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!summary && !isGenerating && (
          <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
            <Sparkles className="w-10 h-10 text-blue-400/80 mx-auto mb-3 animate-bounce" />
            <h4 className="text-sm font-bold text-slate-800">Pronto para gerar o resumo</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Clique no botão superior para que a Inteligência Artificial faça a varredura e analise de todos os seus exames, gerando um resumo unificado em formato de laudo clínico.
            </p>
          </div>
        )}
        
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <Sparkles className="w-5 h-5 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-slate-500 font-bold text-sm animate-pulse">Lendo exames e construindo relatório...</p>
          </div>
        )}
        
        {summary && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#fdfdfd] border border-slate-150 p-6 rounded-2xl shadow-inner relative"
          >
            {/* Medical Sheet Background Lines */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 rounded-l-2xl"></div>
            
            <div className="prose prose-blue max-w-none prose-sm prose-headings:font-bold prose-headings:font-display prose-strong:text-blue-900 prose-ul:list-disc">
              <Markdown>{summary}</Markdown>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
