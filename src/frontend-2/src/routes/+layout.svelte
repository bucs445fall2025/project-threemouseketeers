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
  <div class="route-bar">
    <a class="nav-item", href='/'>Home</a>
    <a class="nav-item", href='/questions'>Questions</a>
  </div>

  <h2>VisitU</h2>

  <div class="user-bar">
    {#if !data.user}
      {#if ($page.url.pathname !== '/log-in') &&  ($page.url.pathname !== '/create-account')}
        <a class="nav-item", href="/log-in">Log In</a>
        <a class="nav-item", href="/create-account">Sign Up</a>        
      {/if}
    {:else}
      <a class="nav-item", href="/profile">My Profile</a>
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

  .navbar h2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
  }

  .user-bar {
    margin-left: auto; 
    margin-right: 0;
    display: block;
  }

  .route-bar {
    margin-left: 0; 
    display: block;
  }

  .nav-item {
  text-decoration: none;
  color: #c6c6c6;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: #92979c;
  color: white;
}

</style>
