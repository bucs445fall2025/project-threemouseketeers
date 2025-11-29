<script>
  export let form = {};

  export let data;
  const user = data.user;
</script>

<h1>Verify email</h1>
{#if data.user}
  <p>User: {data.user.username}</p>
  <p>Email: {data.user.email}</p>


  {#if data.user.verified === undefined}
    <p>Invalid account type.</p>

  {:else if data.user.verified === 0}
    <p>Your email address has not been verified.
    <form method="POST">
        <input
          name="email"
          type="hidden"
          value={data.user.email}
        />
        <button
          type="submit"
          formaction="?/sendVerificationEmail"
        >
          Send Verification Email
        </button>
    </form>

    <form method="POST">
        <input
          name="Verification Code"
          type="text"
          placeholder="verification code"
        />
        <input
          name="email"
          type="hidden"
          value={data.user.email}
        />
        <button
          type="submit"
          formaction="?/checkVerificationCode"
        >
          Enter Verification Code
        </button>
    </form>

  {:else if data.user.verified === 1}
    <p>Email already verified.</p>

  {/if}
{:else}
  <p>No user logged in</p>
{/if}