import { fail } from '@sveltejs/kit'

export const actions = {
  signUp: async ({ request }) => {
    const formData = await request.formData()

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    if (!email || !password) {
      return fail(400, { email, password, missing: true })
    }

    // TODO: API call goes here
    console.log("Creating ", email, ", ", password);

    return { success: true }
  }
  // more actions can go here -- e.g. forgot password?
}