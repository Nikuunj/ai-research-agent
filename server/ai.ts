import OpenAI from "openai";

export const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeText(text: string) {
   const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
         { role: "system", content: "You are a helpful research assistant." },
         {
         role: "user",
         content: `Summarize this text in 3 sentences and list top 5 keywords:\n\n${text}`,
         },
      ],
   });

   return completion.choices[0].message.content ?? "No summary available";
}
