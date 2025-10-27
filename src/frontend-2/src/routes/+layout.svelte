<script>
  export const prerender = true;
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

  import { page } from '$app/stores'; // This gets info about the URL
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
	<ul class="nav-links">
    <li><a href='./'>Home</a></li>
	</ul>
  <div class="user-icon">
    {#if $page.url.pathname === '/log-in'}
      <!-- show Sign Up when on login page -->
      Don't have an account? <a href="/create-account">Sign Up</a>

    {:else if $page.url.pathname === '/create-account'}
      <!-- show Log In when on signup page -->
      Already have an account? <a href="/log-in">Log In</a>

    {:else}
      <!-- show both for all other pages -->
      <a href="/log-in">Log In</a>
      <a href="/create-account">Sign Up</a>
    {/if}
  </div>
</nav>

{@render children?.()}

<style>
  .navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
	}

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .user-icon {
    margin-left: auto; 
    margin-right: 0;
    display: block;
  }

</style>
