export interface ExamResult {
  parametro: string;
  valor: string;
  unidade?: string;
  referencia?: string;
  alterado?: boolean;
}

export interface Exam {
  id: string;
  data: string;
  exame: string;
  laboratorio?: string;
  resultados: ExamResult[];
  originalFileUrl?: string; // object url for local preview
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface Vaccine {
  id: string;
  nome: string;
  data: string;
  dose: string;
  lote?: string;
  local?: string;
  documentUrl?: string;
}

export interface MedicalEvent {
  id: string;
  data: string;
  tipo: 'Cirurgia' | 'Consulta' | 'Internação' | 'Condição Crônica' | 'Outro';
  descricao: string;
  medicoLocal?: string;
  documentUrl?: string;
}
