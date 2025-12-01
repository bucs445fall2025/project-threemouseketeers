<script>
  export const prerender = true;
	import favicon from '$lib/assets/favicon.svg';

  export let data;

  import { page } from '$app/stores'; // This gets info about the URL
  import "../style.css";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
	<ul class="nav-links">
    <li><a href='/'>Home</a></li>
    <li><a href='/questions'>Questions</a></li>	
  </ul>
  <div class="user-bar">
    {#if !data.user}
      {#if $page.url.pathname !== '/log-in' &&  $page.url.pathname !== '/create-account'}
        <a href="/log-in">Log In</a>
        <a href="/create-account">Sign Up</a>        
      {/if}
    {:else}
      <a href="/profile">My Profile</a>
    {/if}
  </div>
</nav>

<slot />


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

  .user-bar {
    margin-left: auto; 
    margin-right: 0;
    display: block;
  }

</style>
