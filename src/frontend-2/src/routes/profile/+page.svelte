
<script>
  export let form = {};
</script>

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