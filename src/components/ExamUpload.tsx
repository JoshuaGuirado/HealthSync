import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { extractExamData } from '../services/geminiService';
import { Exam } from '../types';

interface ExamUploadProps {
  onExamAdded: (exam: Exam) => void;
}

export function ExamUpload({ onExamAdded }: ExamUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Por favor, envie uma imagem (JPG/PNG) ou PDF.');
      return;
    }

    setIsProcessing(true);
    setError(null);

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
            laboratorio: extractedData.laboratorio,
            resultados: extractedData.resultados,
            originalFileUrl: URL.createObjectURL(file)
          };
          
          onExamAdded(newExam);
        } catch (err) {
          setError('Erro ao processar o exame. Tente novamente.');
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Erro ao ler o arquivo.');
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
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 bg-white'
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
        
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">Analisando exame com IA...</p>
              <p className="text-xs text-gray-500">Extraindo dados estruturados e anonimizando informações.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-900">
                Arraste seu exame aqui ou <button onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline">busque no dispositivo</button>
              </p>
              <p className="text-sm text-gray-500">Suporta imagens (JPG, PNG) e PDFs</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
