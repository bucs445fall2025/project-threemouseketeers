import { fail } from '@sveltejs/kit';

const API_BASE = 'http://api:8080';
const API_KEY = '';

/** 
 * @brief form actions that listen to the forms on log-in/+page.svelte
 * 
 * When you submit a form with the associated action, it calls here. This
 * is just a call to the API with the necessary data from the form. 
 */
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

    return { success: true };
  }
};