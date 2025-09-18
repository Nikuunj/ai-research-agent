// src/server/workers/research.worker.ts
import { Queue, Worker } from "bullmq";
import { prisma } from "@/prisma";
import fetch from "node-fetch";
import { analyzeText } from "../ai";

// Connect to Redis (make sure Redis is running in Docker or locally)
export const researchQueue = new Queue("research", {
   connection: { host: "localhost", port: 6379 },
});

// Function to enqueue a job (called from tRPC router)
export async function addResearchJob(id: number, topic: string) {
   await researchQueue.add("process", { id, topic });
}

// Background Worker
new Worker(
   "research",
   async job => {
      const { id, topic } = job.data as { id: number; topic: string };

      try {
         // Step 1: Fetch Wikipedia summary
         const res = await fetch(
         `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            topic
         )}`
         );
         const data = await res.json();

         await prisma.log.create({
         data: { researchId: id, message: "Fetched article from Wikipedia" },
         });

         // Step 2: Ask AI to summarize + extract keywords
         const aiResponse = await analyzeText(data.extract || "");

         await prisma.log.create({
         data: { researchId: id, message: "AI summarization complete" },
         });

         // Step 3: Save results
         await prisma.result.create({
         data: {
            researchId: id,
            title: data.title,
            summary: aiResponse,
            keywords: JSON.stringify([topic]), // could parse keywords separately
         },
         });

         // Step 4: Mark as completed
         await prisma.research.update({
         where: { id },
         data: { status: "completed" },
         });
      } catch (err: any) {
         await prisma.log.create({
         data: {
            researchId: id,
            message: `Error: ${err.message}`,
         },
         });

         await prisma.research.update({
         where: { id },
         data: { status: "failed" },
         });
      }
   },
   { connection: { host: "localhost", port: 6379 } }
);
