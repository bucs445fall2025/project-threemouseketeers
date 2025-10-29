// export const load = ({ cookies }) => {
//   const token = cookies.get('jwt');
//   return { token };
// };

import { hydrateUser, user } from "$lib/stores/auth";

export async function load() {
  await hydrateUser(); // populates store if session cookie valid
  let current;
  user.subscribe(value => current = value)();
  return {user: current};
}
