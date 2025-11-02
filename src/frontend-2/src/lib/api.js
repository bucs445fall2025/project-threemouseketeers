// fetch wrapper

const base = typeof window === 'undefined' ? 'http://localhost:5173' : '';
export async function api(path, init = {}) {
  return await fetch(`${base}/api${path}`, { credentials: 'include', ...init });
}

// // hydrate on app start
// const r = await api('/me');
// if (r.ok) user.set((await r.json()).user);