import { Contractor } from '@prisma/client';

/**
 * Converts an array of contractors into a CSV string.  The order of
 * columns mirrors the specification in the problem description.  If a
 * field is undefined it will be left blank in the CSV.  Commas and
 * quotes are properly escaped.
 */
export function buildCsv(rows: Contractor[]): string {
  const headers = [
    'name',
    'address',
    'city',
    'state',
    'zip',
    'main_service',
    'keywords',
    'phone',
    'website',
    'email',
    'status',
    'assigned_to',
    'notes',
  ];
  const escapeCell = (value: any) => {
    if (value == null) return '';
    let str = String(value);
    if (str.includes('"')) {
      str = str.replace(/"/g, '""');
    }
    if (str.includes(',') || str.includes('\n')) {
      str = `"${str}"`;
    }
    return str;
  };
  const lines = [];
  lines.push(headers.join(','));
  for (const row of rows) {
    const contact = row.contactInfo as any;
    const values = [
      row.name,
      row.address,
      row.city,
      row.state,
      row.zip,
      row.mainService,
      row.keywords ?? '',
      contact?.phone ?? '',
      contact?.website ?? '',
      contact?.email ?? '',
      row.status,
      row.assignedToId ?? '',
      row.notes ?? '',
    ].map(escapeCell);
    lines.push(values.join(','));
  }
  return lines.join('\n');
}