<script>
  import { api } from '$lib/api';
  import { hydrateUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  export let form = {};

  let username = '';
  let email = '';
  let password = '';
  let error = '';

  async function onSubmit(e) {
    e.preventDefault();
    const res = await api('/signup', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({username, email, password})
    });
    if (res.status === 400) {
      form = { apiError: 'Please fill out all fields.' };
      return;
    }
    if (res.status === 409) {
      // conflict
      form = { apiError: 'Email is already in use.' };
      return;
    }
    if(!res.ok) {
      error = 'Sign up failed, please try again later';
      return;
    }

    window.location.href = '/profile';
  }
</script>

<form on:submit|preventDefault={onSubmit}>
  <h1>Sign Up</h1>
  <input bind:value={username} name="username" type="text" placeholder="Username" />
  <input bind:value={email} name="email" type="email" placeholder="Email" />
  <input bind:value={password} name="password" type="password" placeholder="Password" />
  <button type="submit">Sign Up</button>

  {#if form?.missing}
    <p style="color:red">Please fill in all fields.</p>
  {/if}
  {#if form?.apiError}
    <p style="color:red">{form.apiError}</p>
  {/if}
  {#if form?.success}
    <p style="color:green">Signed Up!</p>
  {/if}

  Already have an account? <a href="/log-in">Log In</a>
</form>