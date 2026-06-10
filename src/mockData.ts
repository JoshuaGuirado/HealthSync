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
  },
  {
    id: 'exam-2',
    data: '2024-02-20',
    exame: 'Exame de Sangue de Rotina',
    laboratorio: 'Clínica São Lucas',
    originalFileUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800',
    resultados: [
      { parametro: 'Colesterol Total', valor: '210', unidade: 'mg/dL', referencia: '< 190', alterado: true },
      { parametro: 'Vitamina D', valor: '22', unidade: 'ng/mL', referencia: '> 30', alterado: true },
      { parametro: 'TSH', valor: '2.1', unidade: 'µUI/mL', referencia: '0.4 a 4.5', alterado: false }
    ]
  }
];

export const mockVaccines: Vaccine[] = [
  { id: 'vac-1', nome: 'COVID-19 (Pfizer)', data: '2022-06-10', dose: 'Reforço', lote: 'FA9090', local: 'UBS Centro', documentUrl: 'https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=800' },
  { id: 'vac-2', nome: 'Influenza (Gripe)', data: '2023-04-20', dose: 'Anual', local: 'Clínica Imunizar' },
  { id: 'vac-3', nome: 'Hepatite B', data: '2019-02-15', dose: '3ª Dose', local: 'Posto de Saúde Central', documentUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800' },
  { id: 'vac-4', nome: 'Febre Amarela', data: '2015-11-05', dose: 'Dose Única', local: 'Posto de Saúde Central' }
];

export const mockEvents: MedicalEvent[] = [
  { id: 'evt-1', data: '2015-08-22', tipo: 'Cirurgia', descricao: 'Apendicectomia (Remoção do Apêndice)', medicoLocal: 'Hospital Santa Maria', documentUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800' },
  { id: 'evt-2', data: '2023-10-20', tipo: 'Condição Crônica', descricao: 'Diagnóstico de Dislipidemia (Colesterol Alto)', medicoLocal: 'Dr. Roberto Costa (Cardiologista)' },
  { id: 'evt-3', data: '2024-01-10', tipo: 'Consulta', descricao: 'Retorno Cardiologista - Ajuste de medicação e dieta', medicoLocal: 'Dr. Roberto Costa', documentUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800' }
];
