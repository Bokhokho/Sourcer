import { requireSession } from '@/lib/authGate';
import { prisma } from '@/lib/db';
import dynamic from 'next/dynamic';

const NotificationsClient = dynamic(() => import('@/components/notifications/NotificationsClient'), { ssr: false });

export default async function NotificationsPage() {
  requireSession();
  const notes = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
  const data = notes.map((note) => ({
    id: note.id,
    message: note.message,
    type: note.type,
    read: note.read,
    createdAt: note.createdAt.toLocaleString(),
  }));
  return <NotificationsClient initialData={data} />;
}