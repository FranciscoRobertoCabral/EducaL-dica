
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityIdea } from "../types";

export const generateLessonIdea = async (theme: string, ageGroup: string): Promise<ActivityIdea> => {
  // Inicializa o cliente dentro da função para garantir o uso da chave mais recente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma atividade lúdica detalhada para Educação Infantil. 
      TEMA: "${theme}"
      FAIXA ETÁRIA: "${ageGroup}"
      Importante: Foque em ludicidade, exploração sensorial e brincadeiras práticas.`,
      config: {
        systemInstruction: "Você é um mestre em educação infantil (BNCC). Suas sugestões são criativas, baratas de executar e altamente pedagógicas. Retorne sempre JSON puro.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }, // Baixa latência para simuladores
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título criativo da atividade" },
            objective: { type: Type.STRING, description: "Objetivo pedagógico alinhado ao desenvolvimento infantil" },
            materials: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de materiais simples e acessíveis"
            },
            steps: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Passo a passo da condução da atividade"
            },
            tips: { type: Type.STRING, description: "Uma dica extra para tornar a aula inesquecível" }
          },
          required: ["title", "objective", "materials", "steps", "tips"]
        },
      },
    });

    // O .text já retorna o conteúdo extraído do candidato principal
    const rawContent = response.text;
    if (!rawContent) {
      throw new Error("Resposta vazia da IA");
    }

    // Limpeza robusta de blocos de código Markdown caso a IA os inclua indevidamente
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString) as ActivityIdea;
  } catch (error) {
    console.error("Erro detalhado no simulador:", error);
    throw error;
  }
};
