import { requireSession } from '@/lib/authGate';
import dynamic from 'next/dynamic';

// Dynamically import the ImportForm as a client component.  This
// prevents server rendering from including client‑only hooks.
const ImportForm = dynamic(() => import('@/components/ImportForm'), { ssr: false });

export default function ImporterPage() {
  // Protect the route
  requireSession();
  return <ImportForm />;
}