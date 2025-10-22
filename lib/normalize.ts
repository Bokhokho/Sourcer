/**
 * Utilities for normalizing contractor data.  These helpers are used
 * during the de‑duplication process and when importing businesses
 * from the Google Places API.  Currently they implement very simple
 * logic for address canonicalization and trimming.  Feel free to
 * enhance these routines to handle more edge cases.
 */

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function normalizeAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizeZip(zip: string): string {
  const digits = zip.replace(/[^0-9]/g, '');
  return digits.slice(0, 5);
}