<script lang="js">
  import { api } from '$lib/api';
  import { hydrateUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  // import { hydrate } from 'svelte';

  let email = '';
  let password = '';
  let error = '';

  /**
   * @brief function to call the API to log in the user with the associated data.
   * 
   * @returns A redirect if successful to the profile page
   * @returns 400 if the form is not fully filled out
   * @returns 401 if the email and password do not match a registered account
   * @returns 500 for an internal server error
   * 
   * @param e the form data
   */
  async function onSubmit(e) {
    e.preventDefault();
    const res = await api('/login', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({email, password})
    });
    if (res.status === 400) {
      form = { apiError: 'Please fill out all fields.' };
      return;
    }
    if (res.status === 401) {
      // specific feedback for wrong credentials
      form = { apiError: 'Incorrect email or password.' };
      return;
    }
    if(!res.ok) {
      error = 'Invalid credentials';
      return;
    }
    // await hydrateUser(); //pulls /api/me but with the new cookie
    // goto('/profile', { replaceState: true, reload: true });
    
    window.location.href = '/profile';
  }

  export let form = {};
</script>

<form on:submit|preventDefault={onSubmit}>
  <h1>Log In</h1>
  <input bind:value={email} name="email" type="email" placeholder="email" />
  <input bind:value={password} name="password" type="password" placeholder="password"/>
  <button type="submit">Log In</button>

  {#if form?.missing}
    <p style="color:red">Please fill in all fields.</p>
  {/if}
  {#if form?.apiError}
    <p style="color:red">{form.apiError}</p>
  {/if}
  {#if form?.success}
    <p style="color:green">Signed in!</p>
  {/if}

  Don't have an account? <a href="/create-account">Sign Up</a>
</form>