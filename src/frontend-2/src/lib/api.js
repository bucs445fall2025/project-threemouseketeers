// fetch wrapper

export async function api(path, init = {}) {
  return await fetch(`http://api:8080/api${path}`, { credentials: 'include', ...init });
}

// // hydrate on app start
// const r = await api('/me');
// if (r.ok) user.set((await r.json()).user);