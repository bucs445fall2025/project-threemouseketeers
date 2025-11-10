import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
const API_BASE = 'http://api:8080';
const API_KEY = '';

export const actions = {
  askQuestion: async ({ request, fetch }) => {
    console.log('asking question requested');
    const formData = await request.formData()
    const username = String(formData.get('username'))
    const question = String(formData.get('question'))

    if (!username || !question) {
      return fail(400, { username, question, missing: true })
    }

    try {
      console.log('calling api/askquestion')
      const res = await fetch('http://api:8080/api/askquestion', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({username, question})
      });

      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        return fail(res.status, {apiError: data.error || 'Unable to ask question'});
      }

      return { success: true };
    } catch(err){
      return fail(500, {apiError: err?.message || 'Server error, whoops'});
    }
  }
}
