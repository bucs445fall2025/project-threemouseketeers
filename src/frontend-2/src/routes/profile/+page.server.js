import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
  if (!locals.user) throw redirect(302, '/log-in');
  return { user: locals.user }; // sent to page as props
}
