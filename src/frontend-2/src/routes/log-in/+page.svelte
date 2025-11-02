<script lang="js">
  import { api } from '$lib/api';
  import { hydrateUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  // import { hydrate } from 'svelte';

  let email = '';
  let password = '';
  let error = '';

  async function onSubmit(e) {
    e.preventDefault();
    const res = await api('/login', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({email, password})
    });
    if(!res.ok) {
      error = 'Invalid credentials';
      return;
    }
    await hydrateUser(); //pulls /api/me but with the new cookie
    goto('/profile');

  }

  export let form = {};
</script>

<form on:submit|preventDefault={onSubmit}>
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
</form>