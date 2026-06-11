import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { pingOdiosDatabase } from "@/lib/odios-db.functions";

export const Route = createFileRoute("/debug")({
  component: DebugPage,
  errorComponent: ({ error }) => (
    <pre className="p-6 text-red-600">{String(error)}</pre>
  ),
  notFoundComponent: () => <div className="p-6">Not found</div>,
});

function DebugPage() {
  const ping = useServerFn(pingOdiosDatabase);
  const { data, isLoading, error } = useQuery({
    queryKey: ["odios-ping"],
    queryFn: () => ping(),
  });

  return (
    <main className="min-h-screen bg-white p-8 font-mono text-black">
      <h1 className="text-2xl mb-6">Odios Supabase — Connection Debug</h1>
      {isLoading && <p>Pinging database…</p>}
      {error && (
        <pre className="text-red-600 whitespace-pre-wrap">{String(error)}</pre>
      )}
      {data && (
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
