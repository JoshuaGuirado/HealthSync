import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Loader2, AlertCircle, FileUp, CheckCircle } from 'lucide-react';
import { extractExamData } from '../services/geminiService';
import { Exam } from '../types';

interface ExamUploadProps {
  onExamAdded: (exam: Exam) => void;
}

export function ExamUpload({ onExamAdded }: ExamUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Por favor, envie uma imagem (JPG/PNG) ou PDF.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = (e.target?.result as string).split(',')[1];
        
        try {
          const extractedData = await extractExamData(base64String, file.type);
          
          const newExam: Exam = {
            id: crypto.randomUUID(),
            data: extractedData.data,
            exame: extractedData.exame,
            laboratorio: extractedData.laboratorio || 'Clínica / Laboratório',
            resultados: extractedData.resultados,
            originalFileUrl: URL.createObjectURL(file)
          };
          
          onExamAdded(newExam);
          setUploadSuccess(true);
          
          // Reset success state after a few seconds
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
        } catch (err) {
          setError('Erro ao processar o exame com IA. Verifique se o arquivo está legível ou se a sua GEMINI_API_KEY está configurada no Vercel.');
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Erro ao ler o arquivo selecionado.');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        layout
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/5 shadow-inner scale-[1.01]' 
            : isProcessing 
              ? 'border-indigo-400 bg-slate-50' 
              : 'border-slate-300 hover:border-indigo-400 bg-white shadow-sm'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && processFile(e.target.files[0])}
          className="hidden"
          accept="image/*,application/pdf"
        />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-5 py-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                <FileUp className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 font-display">Analisando exame com IA...</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Lendo parâmetros médicos, identificando valores alterados e anonimizando dados sensíveis.
                </p>
              </div>
            </motion.div>
          ) : uploadSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-4 py-6 text-emerald-600"
            >
              <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold font-display">Exame Importado!</p>
                <p className="text-xs text-emerald-700/80">
                  Os dados foram estruturados e salvos no seu prontuário digital.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-5 py-4"
            >
              <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-bold text-slate-800 font-display">
                  Arraste seu laudo aqui ou{' '}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold transition-all"
                  >
                    busque no computador
                  </button>
                </p>
                <p className="text-xs text-slate-400">Suporta PDFs ou imagens nítidas (JPG, PNG)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start space-x-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
