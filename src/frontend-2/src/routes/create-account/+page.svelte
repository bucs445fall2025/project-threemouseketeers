<script>
	let message = '';
	let color = '';
	
	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const res = await fetch('?/signUp', {
			method: 'POST',
			body: formData
		});

		if (res.status === 500) {
			message = 'Account created!';
			color = 'green';
		} else if (res.status === 201) {
			message = 'Please fill in all fields.';
			color = 'red';
		} else {
			message = `Unexpected response (${res.status})`;
			color = 'orange';
		}
	}
</script>

<form on:submit={handleSubmit}>
	<input type="text" name="email" placeholder="Email" />
	<input type="password" name="password" placeholder="Password" />
	<button type="submit">Sign Up</button>
</form>

{#if message}
<p style="color:{color}">{message}</p>
{/if}