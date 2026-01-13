
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLessonIdea = async (theme: string, ageGroup: string): Promise<ActivityIdea> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crie uma atividade lúdica para Educação Infantil com o tema "${theme}" para a faixa etária "${ageGroup}".`,
    config: {
      systemInstruction: "Você é um especialista em educação infantil lúdica e neuroeducação. Crie atividades práticas, simples e altamente envolventes que não exijam materiais caros.",
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

  return JSON.parse(response.text || '{}') as ActivityIdea;
};
