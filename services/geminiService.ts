
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityIdea } from "../types";

export const generateLessonIdea = async (theme: string, ageGroup: string): Promise<ActivityIdea> => {
  // Inicialização direta conforme diretrizes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma atividade lúdica para Educação Infantil. 
      TEMA: "${theme}"
      FAIXA ETÁRIA: "${ageGroup}"`,
      config: {
        systemInstruction: "Você é um especialista em educação infantil lúdica. Crie atividades práticas, divertidas e educativas. Retorne APENAS o JSON puro, sem blocos de código Markdown.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            objective: { type: Type.STRING },
            materials: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            steps: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tips: { type: Type.STRING }
          },
          required: ["title", "objective", "materials", "steps", "tips"]
        },
      },
    });

    const text = response.text || '';
    // Limpeza de possíveis blocos de código Markdown para evitar erro no JSON.parse
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as ActivityIdea;
  } catch (error) {
    console.error("Erro no GeminiService:", error);
    throw new Error("Não foi possível gerar a atividade no momento.");
  }
};
