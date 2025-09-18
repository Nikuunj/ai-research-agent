// src/server/routers/research.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/prisma";
import { addResearchJob } from "../workers/research.worker";

export const researchRouter = router({
   // 🚀 Create a new research request
   create: publicProcedure
      .input(z.object({ topic: z.string().min(3) }))
      .mutation(async ({ input }) => {
         // Step 1: Save research request in DB
         const research = await prisma.research.create({
         data: { topic: input.topic, status: "processing" },
         });

         // Step 2: Add async job to queue
         await addResearchJob(research.id, input.topic);

         return research;
      }),

   // 📋 List all research requests
   list: publicProcedure.query(() =>
      prisma.research.findMany({
         orderBy: { createdAt: "desc" },
         select: { id: true, topic: true, status: true, createdAt: true },
      })
   ),

   // 🔍 Get details (logs + results) for one research request
   getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) =>
         prisma.research.findUnique({
         where: { id: input.id },
         include: { logs: true, results: true },
         })
      ),
});
