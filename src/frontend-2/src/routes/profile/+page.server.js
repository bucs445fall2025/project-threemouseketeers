import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
const API_BASE = 'http://api:8080';
const API_KEY = '';

/*export function load({ locals }) {
  if (!locals.user) throw redirect(302, '/log-in');
  return { user: locals.user }; // sent to page as props
}*/

export const actions = {
  fetchBio: async ({ request, fetch }) => {
    console.log('fetch bio requested');
    const formData = await request.formData()
    const username = String(formData.get('username'))

    if (!username) {
      return fail(400, { username, missing: true })
    }

    try {
    console.log('calling api/fetchbio')
    const res = await fetch('http://api:8080/api/fetchbio', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'},
      body: JSON.stringify({username})
    });

    const data = await res.json().catch(() => ({}));
    if(!res.ok) {
      return fail(res.status, {username, apiError: data.error || 'Fetch bio failed, whoops'});
    }

      return {success: true, userBio: data.bio};
    } catch(err){
      return fail(500, {username, apiError: err?.message || 'Server error, whoops'});
    }
  },

  updateBio: async ({ request, fetch }) => {
    console.log('update bio requested');
    const formData = await request.formData()
    const username = String(formData.get('username'))
    const newBio = String(formData.get('newBio'))

    if (!username || !newBio) {
      return fail(400, { username, newBio, missing: true })
    }

    try {
      console.log('calling api/updatebio')
      const res = await fetch('http://api:8080/api/updatebio', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({username, newBio})
      });

      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        return fail(res.status, {username, apiError: data.error || 'Update bio failed, whoops'});
      }

      return {success: true, userBio: data.bio};
    } catch(err){
      return fail(500, {username, apiError: err?.message || 'Server error, whoops'});
    }
  }
}
