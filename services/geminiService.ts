
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, Mood } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeDiaryEntry(content: string, mood: Mood): Promise<AIInsight | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음은 오늘의 일기 내용과 사용자가 선택한 기분입니다. 이 일기를 분석해서 JSON 형태로 응답해줘.
      
      일기 내용: "${content}"
      사용자가 선택한 기분: ${mood}

      반드시 다음 형식을 지켜줘:
      - moodAnalysis: 사용자의 감정 상태에 대한 깊이 있는 분석 (한국어)
      - summary: 일기의 핵심 내용을 1-2문장으로 요약 (한국어)
      - advice: 사용자에게 건네는 따뜻한 조언이나 질문 (한국어)
      - keywords: 일기에서 추출한 주요 키워드 리스트 (한국어)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            moodAnalysis: { type: Type.STRING },
            summary: { type: Type.STRING },
            advice: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["moodAnalysis", "summary", "advice", "keywords"]
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text.trim()) as AIInsight;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function suggestCalendarEvent(content: string): Promise<{ summary: string, description: string } | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 일기 내용에서 중요한 약속이나 일정을 추출해서 구글 캘린더 이벤트 형식으로 만들어줘: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "이벤트 제목" },
            description: { type: Type.STRING, description: "이벤트 상세 내용" }
          },
          required: ["summary", "description"]
        }
      }
    });
    if (!response.text) return null;
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return null;
  }
}
