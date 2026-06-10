import { GoogleGenAI, Type } from "@google/genai";
import { Exam } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada. Por favor, adicione a chave de API nas configurações do Vercel.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `Você é um assistente de estruturação de dados de saúde. Sua função é organizar, classificar e resumir laudos médicos fornecidos pelo usuário. Você NUNCA deve dar diagnósticos, sugerir tratamentos ou substituir aconselhamento médico profissional. Baseie-se ESTRITAMENTE nos dados fornecidos. Sempre cite os dados do exame ao responder.`;

export async function extractExamData(base64Data: string, mimeType: string) {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          }
        },
        "Extraia as informações deste exame médico. Retorne os dados estruturados. Anonimize o nome do paciente e CPF se houver."
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            data: { type: Type.STRING, description: "Data do exame no formato YYYY-MM-DD" },
            exame: { type: Type.STRING, description: "Nome ou tipo do exame (ex: Hemograma Completo, Glicemia)" },
            laboratorio: { type: Type.STRING, description: "Nome do laboratório ou clínica" },
            resultados: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parametro: { type: Type.STRING },
                  valor: { type: Type.STRING },
                  unidade: { type: Type.STRING },
                  referencia: { type: Type.STRING },
                  alterado: { type: Type.BOOLEAN, description: "Verdadeiro se o valor estiver fora da referência" }
                }
              }
            }
          },
          required: ["data", "exame", "resultados"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Resposta vazia da IA");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao extrair dados do exame:", error);
    throw error;
  }
}

export async function generateMedicalSummary(exams: Exam[]) {
  if (!exams || exams.length === 0) {
    return "Nenhum exame disponível para gerar resumo.";
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um resumo médico cronológico e conciso (Elevator Pitch Médico) baseado nos seguintes exames. 
      Destaque resultados alterados e tendências ao longo do tempo. 
      Seja direto, profissional e focado no que um médico precisaria saber em 1 minuto.
      Não dê diagnósticos.
      
      Exames do Paciente:
      ${JSON.stringify(exams, null, 2)}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    throw error;
  }
}

export async function askMedicalRecord(exams: Exam[], question: string, history: {role: string, text: string}[] = []) {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\\n\\nHistórico Médico do Paciente:\\n" + JSON.stringify(exams, null, 2),
      }
    });

    // Replay history if needed, though for a simple prototype we might just send the context in the prompt
    // The @google/genai chat doesn't easily let us set history on create in a simple way without sending messages.
    // Let's just use generateContent with the full context for statelessness, which is easier for prototypes.
    
    const contents: any[] = [
      { role: "user", parts: [{ text: `Aqui está o meu histórico médico em JSON:\n${JSON.stringify(exams)}\n\nResponda às minhas perguntas com base APENAS nestes dados.` }] },
      { role: "model", parts: [{ text: "Entendido. Estou pronto para responder perguntas sobre o seu histórico médico." }] }
    ];

    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao conversar com o prontuário:", error);
    throw error;
  }
}
