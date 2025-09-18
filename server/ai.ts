// src/server/ai.ts
import { GoogleGenAI } from "@google/genai";

// initialize Gemini client using env var
const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY, // or GOOGLE_API_KEY
});

export async function analyzeText(text: string): Promise<string | undefined> {
   const prompt = `
      Summarize the following text and extract **5-10 relevant keywords** that describe the topic.
      Return ONLY a JSON object with:
      {
      "summary": "...",
      "keywords": ["...", "...", "..."]
      }
      Text: ${text}
   `;
   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
   });
   return response.text;
}
