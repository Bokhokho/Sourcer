import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Retrieves the currently selected actor from signed cookies.
 * Returns `null` if the identity hasn't been set.
 */
export function getActor(): string | null {
  const store = cookies();
  const actor = store.get('actor')?.value;
  return actor ?? null;
}

/**
 * Determines whether the current actor is the Admin.  Use this to
 * control privileged functionality on the frontend and backend.
 */
export function isAdmin(): boolean {
  return getActor() === 'Admin';
}

/**
 * Simple helper to protect a server component or route.  If the
 * `session` cookie is missing the user is redirected to the auth gate.
 */
export function requireSession() {
  const store = cookies();
  const session = store.get('session')?.value;
  if (!session) {
    redirect('/auth/gate');
  }
}