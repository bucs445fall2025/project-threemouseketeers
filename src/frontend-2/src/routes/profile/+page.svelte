<script>

  export let form = {};

  export let data;
  const user = data.user;

  let showDeleteModal = false;
  let deleting = false;
  let error = "";

  async function deleteAccount() {
    deleting = true;
    error = "";

    try {
      const res = await fetch('/api/deleteaccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.error || 'Failed to delete account.';
        deleting = false;
        return;
      }

      // Redirect after deletion
      window.location.href = '/';
    } catch (err) {
      error = err.message || 'Server error';
      deleting = false;
    }
  }

</script>

<form method="POST">
  <button
    type="submit"
    formaction="?/logout"
    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
  >
    Log out
  </button>
</form>

<button class="delete-btn" on:click={() => showDeleteModal = true}>
  Delete Account
</button>

{#if showDeleteModal}
  <div class="modal-backdrop" on:click={() => showDeleteModal = false}></div>
  
  <div class="modal">
    <h2>Confirm Account Deletion</h2>
    <p>Are you sure you want to delete your account? This action cannot be undone.</p>

    <div class="buttons">
      <button type="button" on:click={() => showDeleteModal = false}>
        Cancel
      </button>
      <button type="button" on:click={deleteAccount} disabled={deleting}>
        {#if deleting}Deleting…{:else}Delete Account{/if}
      </button>
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
{/if}


{#if data.user}
  <h1>Hello, {data.user.username}</h1>
  <p>{data.user.bio}</p>

  <form method="POST">
    <input name="newBio" type="text" placeholder="New Bio"/>
    <input name="username" type="hidden" value={data.user.username}/>
    <button
      type="submit"
      formaction="?/updateBio"
    >
      Update Bio
    </button>

    {#if form?.missing}
      <p style="color:red">Please fill in all fields.</p>
    {/if}
    {#if form?.apiError}
      <p style="color:red">{form.apiError}</p>
    {/if}
    {#if form?.success}
      <p style="color:green">User bio updated!</p>
    {/if}
  </form>

  {#if data.user.verified === 0}
    <form method="POST">
      <button
        type="submit"
        formaction="?/verify"
      >
        Verify Email
      </button>
    </form>
  {/if}

{:else}
  <h1>Loading…</h1> <!-- This should really never happen -->
{/if}

<style>
  .delete-btn {
    padding: 0.5rem 1rem;
    background: #e53e3e;
    color: white;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .delete-btn:hover {
    background: #c53030;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 20;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
    z-index: 21;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }

  .error {
    margin-top: 0.5rem;
    color: red;
  }
</style>