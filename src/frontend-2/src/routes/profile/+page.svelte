<script>
  export let data; // Returned from the load function in ./+page.server.js -- automatically injected with what is returned from load, always
</script>

<h1>Welcome, {data.user.name}!</h1>
