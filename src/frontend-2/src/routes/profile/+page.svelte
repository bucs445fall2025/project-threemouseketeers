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
  <h1>Hello, {data.user.username}</h1>
  <p>{data.user.bio}</p>

  <form method="POST">
    <input name="newBio" type="text" placeholder="New Bio"/>
    <input name="username" type="hidden" value={data.user.username}/>
    <button
      type="submit"
      formaction="?/updateBio"
    >
      Update Bio
    </button>

    {#if form?.missing}
      <p style="color:red">Please fill in all fields.</p>
    {/if}
    {#if form?.apiError}
      <p style="color:red">{form.apiError}</p>
    {/if}
    {#if form?.success}
      <p style="color:green">User bio updated!</p>
    {/if}
  </form>

  {#if data.user.verified === 0}
    <form method="POST">
      <button
        type="submit"
        formaction="?/verify"
      >
        Verify Email
      </button>
    </form>
  {/if}

{:else}
  <h1>Loading…</h1> <!-- This should really never happen -->
{/if}