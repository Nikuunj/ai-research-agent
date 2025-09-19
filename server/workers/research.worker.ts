import { Queue, Worker } from "bullmq";
import { prisma } from "@/prisma";
import { analyzeText } from "../ai";
import { redisConfig } from "../radisConfig";

export const researchQueue = new Queue("research", {
   connection: redisConfig
});

export async function addResearchJob(id: number, topic: string) {
   await researchQueue.add("process", { id, topic });
}

new Worker(
   "research",
   async (job) => {
      const { id, topic } = job.data as { id: number; topic: string };

      try {
         // Fetch Wikipedia article
         const res = await fetch(
         `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
         );
         const data = await res.json();

         await prisma.log.create({
         data: { researchId: id, message: "Fetched article from Wikipedia" },
         });

         // --- Summarize and extract keywords using AI ---
         const aiResponse = await analyzeText(data.extract || "");

         // Defaults
         let summary = data.extract || "";
         let keywords: string[] = [topic.toLowerCase()];

         if (aiResponse) {
         // Remove markdown backticks and extra whitespace
         const cleanResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();

         try {
            const parsed = JSON.parse(cleanResponse);

            // Store parsed summary and keywords
            summary = parsed.summary ? parsed.summary.trim() : summary;
            keywords = parsed.keywords?.length
               ? parsed.keywords.map((k: string) => k.toLowerCase())
               : [topic.toLowerCase()];
         } catch {
            // Fallback: Wikipedia extract and topic as keyword
            summary = data.extract || "";
            keywords = [topic.toLowerCase()];
         }
         }

         // Ensure keywords are unique
         keywords = Array.from(new Set(keywords));

         // Store result in DB
         await prisma.result.create({
         data: {
            researchId: id,
            title: data.title || topic,
            summary,
            source:
               data.content_urls?.desktop?.page ||
               `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
            keywords: JSON.stringify(keywords),
         },
         });

         // Mark research as completed
         await prisma.research.update({
         where: { id },
         data: { status: "completed" },
         });
      } catch (err: any) {
         // Log errors and mark research as failed
         await prisma.log.create({
         data: { researchId: id, message: `Error: ${err.message}` },
         });
         await prisma.research.update({
         where: { id },
         data: { status: "failed" },
         });
      }
   },
   {
      connection: redisConfig,
      concurrency: 5,
   }
);
