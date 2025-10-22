"use client";

import { useRouter } from 'next/navigation';
import ContractorTable, { Member, ContractorRow } from './ContractorTable';

interface Props {
  lists: { member: Member; contractors: ContractorRow[] }[];
  members: Member[];
  actor: string;
}

/**
 * Client component for the sourcing view.  Renders a section per member
 * containing their assigned contractors.  Updates to contractors will
 * trigger a router refresh to fetch fresh data from the server.
 */
export default function SourcingClient({ lists, members, actor }: Props) {
  const router = useRouter();
  const handleUpdated = () => router.refresh();
  return (
    <div className="space-y-8">
      {lists.map((list) => (
        <section key={list.member.id} className="space-y-4">
          <h2 className="text-xl font-semibold">{list.member.name}'s List</h2>
          {list.contractors.length > 0 ? (
            <ContractorTable
              data={list.contractors}
              members={members}
              actor={actor}
              onUpdated={handleUpdated}
            />
          ) : (
            <p className="text-gray-500 text-sm">No contractors assigned.</p>
          )}
        </section>
      ))}
    </div>
  );
}