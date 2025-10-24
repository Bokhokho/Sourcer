import { requireSession } from '@/lib/authGate';
import dynamic from 'next/dynamic';

// Dynamically import the ImportForm as a client component.  This
// prevents server rendering from including client‑only hooks.
const ImportForm = dynamic(() => import('@/components/ImportForm'), { ssr: false });

export default function ImporterPage() {
  // Protect the route
  requireSession();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Importer</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Search for new contractors via Google Places and import them into your pipeline.
      </p>
      <ImportForm />
    </div>
  );
}