<script>
  export const prerender = true;
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
	<ul class="nav-links">
    <li><a href='./create-account'>Sign Up</a></li>
    <li>Already have an account?<a href='./log-in'>Log In</a></li>
	</ul>
</nav>

{@render children?.()}

<style>
  .navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
	}
</style>
