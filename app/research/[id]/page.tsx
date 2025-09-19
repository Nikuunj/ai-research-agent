"use client";

import { trpc } from "@/utils/trpc";

export default async function ResearchDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const research = trpc.research.getById.useQuery({ id });

  if (research.isLoading) return <p className="p-6">Loading...</p>;
  if (!research.data) return <p className="p-6">Not found</p>;

  console.log(research.data);
  

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">{research.data.topic}</h1>
      <p className="mt-1">Status: <span className="font-medium">{research.data.status}</span></p>

      {/* Logs */}
      <h2 className="mt-6 font-semibold">Logs</h2>
      {research.data.logs.length === 0 ? (
        <p className="text-gray-500 mt-2">No logs yet.</p>
      ) : (
        <ul className="list-disc list-inside mt-2">
          {research.data.logs.map((log) => (
            <li key={log.id}>{log.message}</li>
          ))}
        </ul>
      )}

      {/* Results */}
      <h2 className="mt-6 font-semibold">Results</h2>
      {research.data.results.length === 0 ? (
        <p className="text-gray-500 mt-2">No results yet.</p>
      ) : (
        research.data.results.map((res) => {
          let keywords: string[] = [];
          try {
            keywords = JSON.parse(res.keywords);
          } catch {
            keywords = [];
          }

          return (
            <div key={res.id} className="border rounded p-3 mt-2">
              <h3 className="font-bold">{res.title}</h3>
              <p className="mt-1">{res.summary}</p>
              {keywords.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Keywords: {keywords.join(", ")}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
