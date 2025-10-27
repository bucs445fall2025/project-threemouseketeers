<script>
  export let form = {};
</script>

<form method="POST" action="?/logIn">
  <input name="email" type="email" placeholder="email" />
  <input name="password" type="password" placeholder="password"/>
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