import { fail } from '@sveltejs/kit';
// import { env } from '$env/static/private';

// const API_BASE = env.API_BASE || 'http://api:8080';
// const API_KEY = env.API_KEY || '';
const API_BASE = 'http://api:8080';
const API_KEY = '';

export const actions = {
  logIn: async ({ request, fetch }) => {
    console.log('log in requested');
    const formData = await request.formData();

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (!email || !password) {
      console.log('email or password missing');
      return fail(400, { email, password, missing: true })
    }
    
    console.log("Logging in ", email, ", ", password);
    try {
      console.log('calling api/login')
      const res = await fetch('http://api:8080/api/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({ email, password})
        });
        console.log(res.ok);
        console.log(res.status);
        console.log("res = ", res);
        
        const data = await res.json().catch(() => ({}));
        // data.json()
        if(!res.ok) {
          return fail(res.status, {email, apiError: data.error || 'Log-in failed.'});
        }
        console.log('login succeeded');
        return {success: true, userId: data.id};
    } catch(err){
      return fail(500, {email, apiError: err?.message || 'Server error'});
    }
  }
  // more actions can go here -- e.g. forgot password?
}