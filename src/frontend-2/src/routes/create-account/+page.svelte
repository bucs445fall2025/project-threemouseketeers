<script>
  export let form = {};
</script>

<form method="POST" action="?/signUp">
  <input name="username" type="text" placeholder="Username" />
  <input name="email" type="email" placeholder="Email" />
  <input name="password" type="password" placeholder="Password" />
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
</form>