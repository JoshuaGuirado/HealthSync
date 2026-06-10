import { Exam, Vaccine, MedicalEvent } from './types';

export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    data: '2023-10-15',
    exame: 'Hemograma Completo e Perfil Lipídico',
    laboratorio: 'LabVida Diagnósticos',
    originalFileUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    resultados: [
      { parametro: 'Hemácias', valor: '4.8', unidade: 'milhões/mm³', referencia: '4.3 a 5.7', alterado: false },
      { parametro: 'Hemoglobina', valor: '14.2', unidade: 'g/dL', referencia: '13.5 a 17.5', alterado: false },
      { parametro: 'Colesterol Total', valor: '245', unidade: 'mg/dL', referencia: '< 190', alterado: true },
      { parametro: 'Triglicerídeos', valor: '180', unidade: 'mg/dL', referencia: '< 150', alterado: true },
      { parametro: 'Glicemia de Jejum', valor: '92', unidade: 'mg/dL', referencia: '70 a 99', alterado: false }
    ]
  }
];

export const mockVaccines: Vaccine[] = [
  { 
    id: 'vac-1', 
    nome: 'COVID-19 (Pfizer)', 
    data: '2022-06-10', 
    dose: 'Reforço', 
    lote: 'FA9090', 
    local: 'UBS Centro', 
    documentUrl: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=800' 
  }
];

export const mockEvents: MedicalEvent[] = [
  { 
    id: 'evt-1', 
    data: '2015-08-22', 
    tipo: 'Cirurgia', 
    descricao: 'Apendicectomia (Remoção do Apêndice)', 
    medicoLocal: 'Hospital Santa Maria', 
    documentUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800' 
  }
];
