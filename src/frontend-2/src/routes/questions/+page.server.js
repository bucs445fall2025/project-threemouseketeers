import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
const API_BASE = 'http://api:8080';
const API_KEY = '';

/** 
 * @brief form actions that listen to the forms on questions/+page.svelte
 * 
 * When you submit a form with the associated action, it calls here. These
 * are just calls to the API with the necessary data from the form. 
 */
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
  },

  answerQuestion: async ({ request, fetch }) => {
    console.log('asking question requested');
    const formData = await request.formData()
    const username = String(formData.get('username'));
    const questionID = String(formData.get('questionID'));
    const answer = String(formData.get('answer'));

    if (!username || !questionID || !answer) {
      return fail(400, { username, questionID, answer, missing: true })
    }

    try {
      console.log('calling api/askquestion')
      const res = await fetch('http://api:8080/api/answerquestion', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({username, questionID, answer})
      });

      const data = await res.json().catch(() => ({}));
      if(!res.ok) {
        return fail(res.status, {apiError: data.error || 'Unable to answer question'});
      }

      return { success: true };
    } catch(err){
      return fail(500, {apiError: err?.message || 'Server error, whoops'});
    }
  }
}
