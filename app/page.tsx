"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
   const [topic, setTopic] = useState("");
   const utils = trpc.useUtils();

   const createResearch = trpc.research.create.useMutation({
      onSuccess: () => {
         utils.research.list.invalidate(); // refresh list after submit
      },
   });

   const researchList = trpc.research.list.useQuery(undefined, {
      refetchInterval: 3000,
   });

   return (
      <div className="p-6 max-w-2xl mx-auto">
         <h1 className="text-2xl font-bold">AI Research Agent</h1>

         {/* Input form */}
         <form
            onSubmit={(e) => {
               e.preventDefault();
               if (!topic.trim()) return;
               createResearch.mutate({ topic });
               setTopic("");
            }}
            className="flex gap-2 mt-4"
         >
            <input
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               placeholder="Enter a topic..."
               className="border rounded p-2 flex-1"
            />
            <button
               type="submit"
               className="bg-blue-600 text-white px-4 py-2 rounded"
            >
               Submit
            </button>
         </form>

         {/* List of research requests */}
         <h2 className="mt-6 font-semibold">Research History</h2>
         <ul className="mt-2 space-y-2">
            {researchList.data?.map((r) => (
               <li
                  key={r.id}
                  className="border p-2 rounded flex justify-between"
               >
                  <span>
                     <strong>{r.topic}</strong> — {r.status}
                  </span>
                  <Link
                     href={`/research/${r.id}`}
                     className="text-blue-600 underline"
                  >
                     View
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}
