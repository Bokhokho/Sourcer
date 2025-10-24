"use client";

import { useRouter } from 'next/navigation';
import ContractorTable, { Member, ContractorRow } from './ContractorTable';

interface Props {
  initialData: ContractorRow[];
  members: Member[];
  actor: string;
  myMemberId?: string | null;
}

/**
 * Wrapper component for the responsive view.  It receives the initial
 * dataset from the server and uses the router refresh mechanism to
 * reload the data after updates.  This component is client‑side only.
 */
export default function ResponsiveClient({ initialData, members, actor, myMemberId }: Props) {
  const router = useRouter();
  const handleUpdated = () => router.refresh();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Responsive Contractors</h2>
      <ContractorTable
        data={initialData}
        members={members}
        actor={actor}
        myMemberId={myMemberId}
        showMoveToMe={true}
        onUpdated={handleUpdated}
      />
    </div>
  );
}