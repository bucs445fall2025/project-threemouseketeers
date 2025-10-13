import { fail } from '@sveltejs/kit'

export const actions = {
  signUp: async ({ request }) => {
    const apiUrl = process.env.API_URL || 'http://localhost:8080'; // Fall back to 8080 if API_URL doesn't exist in env

    const formData = await request.formData()

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    if (!email || !password) {
      return fail(400, { email, password, missing: true })
    }
    
    console.log("Creating ", email, ", ", password);

    // Call to the API
    const res = await fetch(`${apiUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
    return new Response(JSON.stringify({ error: 'API request failed' }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  }
  // more actions can go here -- e.g. forgot password?
}