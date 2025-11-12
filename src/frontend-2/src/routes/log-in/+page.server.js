import { fail } from '@sveltejs/kit';
// import { env } from '$env/static/private';

// const API_BASE = env.API_BASE || 'http://api:8080';
// const API_KEY = env.API_KEY || '';
const API_BASE = 'http://api:8080';
const API_KEY = '';

export const actions = {
  logIn: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return fail(400, { missing: true });
    }

    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return fail(res.status, { apiError: data.error });
    }

    const data = await res.json().catch(() => ({}));
    // cookies.set('jwt', data.token, {
    //   path: '/',
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false,  // true in production with HTTPS
    //   maxAge: 60 * 60 * 24 // 1 day
    // });

    return { success: true };
  }
};