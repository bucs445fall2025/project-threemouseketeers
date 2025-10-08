<script>
  export let form;
</script>

<h1>Sign Up</h1>

<form method="POST" action="?/signUp">
  <input type="text" name="email" placeholder="Email">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Sign Up</button>

  {#if form?.missing}
    <p style="color:red">Please fill in all fields.</p>
  {/if}

  {#if form?.success}
    <p style="color:green">Account created!</p>
  {/if}
</form>