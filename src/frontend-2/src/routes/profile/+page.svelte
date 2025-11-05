<script>

  export let form = {};

  export let data;
  const user = data.user;
</script>

<form method="POST">
  <button
    type="submit"
    formaction="?/logout"
    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
  >
    Log out
  </button>
</form>

{#if data.user}
  <h1>{data.user.username} (the former)</h1>
{:else}
  <h1>Loading…</h1>
{/if}

{#if user}
  <h1>{user.username} (the latter)</h1>
{/if}

<form method="POST" action="?/fetchBio">
  <input name="username" type="text" placeholder="Username" />
  <button type="submit">Fetch Bio</button>

  {#if form?.missing}
    <p style="color:red">Please fill in all fields.</p>
  {/if}
  {#if form?.apiError}
    <p style="color:red">{form.apiError}</p>
  {/if}
  {#if form?.success}
    <p style="color:green">User bio found!</p>
    <p>{form?.userBio}</p>
  {/if}
</form>

<form method="POST" action="?/updateBio">
  <input name="username" type="text" placeholder="Username" />
  <input name="newBio" type="text" placeholder="New Bio" />
  <button type="submit">Update Bio</button>

  {#if form?.missing}
    <p style="color:red">Please fill in all fields.</p>
  {/if}
  {#if form?.apiError}
    <p style="color:red">{form.apiError}</p>
  {/if}
  {#if form?.success}
    <p style="color:green">User bio updated!</p>
    <p>{form?.userBio}</p>
  {/if}
</form>