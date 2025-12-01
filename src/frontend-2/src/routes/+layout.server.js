//layout.server.js

/**
 * Each time a page is loaded, we call the me API endpoint
 * to authenticate/get the session store
 */
export async function load({ fetch }) {
  const r = await fetch('/api/me', { cache: 'no-store' });
  if (!r.ok) return { user: null };
  const { user } = await r.json(); // { id, username, email, bio }
  return { user };
}
