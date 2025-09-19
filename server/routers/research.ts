import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/prisma";
import { addResearchJob } from "../workers/research.worker";

export const researchRouter = router({
  create: publicProcedure
    .input(z.object({ topic: z.string().min(3) }))
    .mutation(async ({ input }) => {
      const research = await prisma.research.create({
        data: { topic: input.topic, status: "processing" },
      });

      await addResearchJob(research.id, input.topic);
      return research;
    }),

  list: publicProcedure.query(() =>
    prisma.research.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, topic: true, status: true, createdAt: true },
    })
  ),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) =>
      prisma.research.findUnique({
        where: { id: input.id },
        include: {
          logs: { orderBy: { id: "asc" } }, // logs in order
          results: { orderBy: { id: "asc" } }, // results in order
        },
      })
    ),
});
