import { fail } from '@sveltejs/kit';
// import { env } from '$env/static/private';

// const API_BASE = env.API_BASE || 'http://api:8080';
// const API_KEY = env.API_KEY || '';
const API_BASE = 'http://api:8080';
const API_KEY = '';

/** 
 * @brief form actions that listen to the forms on create-account/+page.svelte
 * 
 * When you submit a form with the associated action, it calls here. This
 * is just a call to the API with the necessary data from the form. 
 */
export const actions = {
  signUp: async ({ request, fetch }) => {
    console.log('sign up requested');
    const formData = await request.formData()

    const username = String(formData.get('username'))
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    if ( !username || !email || !password) {
      return fail(400, { username, email, password, missing: true })
    }
    
    console.log("Creating ", username, ", ", email, ", ", password);
    try {
      console.log('calling api/signup')
      const res = await fetch('http://api:8080/api/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({ username, email, password})
        });

      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        return fail(res.status, {email, apiError: data.error || 'Sign-up failed, whoops'});
      }

      const loginRes = await fetch('http://api:8080/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginRes.json().catch(() => ({}));

      if (!loginRes.ok) {
        return fail(loginRes.status, { email, apiError: loginData.error || 'Login failed' });
      }

      // If login sets a cookie, SvelteKit will forward it automatically if fetch is the load-action fetch.
      return { success: true, user: loginData.user || { id: data.id, email } };
      
      return {success: true, userId: data.id};
    } catch(err){
      return fail(500, {email, apiError: err?.message || 'Server error, whoops'});
    }
  }
  // more actions can go here -- e.g. forgot password?
}