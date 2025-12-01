<script>

  export let form = {};

  export let data;
  const user = data.user;

  let showDeleteModal = false;
  let deleting = false;
  let error = "";

  /**
   * @brief function to delete an account when the button is pressed
   * 
   * Removes the session information and deletes the user entry from the database. This will
   * not remove the users questions
   * 
   * @returns a redirect to the home page if successful
   */
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

{#if data.user}
  <section class="profile-card">
    <h1>Hello, {data.user.username}</h1>
    <p class="bio">{data.user.bio || "No bio set yet."}</p>

    <form method="POST" class="update-bio-form">
      <input name="newBio" type="text" placeholder="New Bio" />
      <input name="username" type="hidden" value={data.user.username} />
      <button type="submit" formaction="?/updateBio">Update Bio</button>

      {#if form?.missing}
        <p class="feedback error">Please fill in all fields.</p>
      {/if}
      {#if form?.apiError}
        <p class="feedback error">{form.apiError}</p>
      {/if}
      {#if form?.success}
        <p class="feedback success">User bio updated!</p>
      {/if}
    </form>

    {#if data.user.verified === 0}
      <form method="POST">
        <button type="submit" class="verify-btn" formaction="?/verify">Verify Email</button>
      </form>
    {/if}

    <div class="account-actions">
      <form method="POST">
        <button type="submit" class="logout-btn" formaction="?/logout">Log Out</button>
      </form>
      <button class="delete-btn" on:click={() => showDeleteModal = true}>Delete Account</button>
    </div>
  </section>

  {#if showDeleteModal}
    <div class="modal-backdrop" on:click={() => showDeleteModal = false}></div>

    <div class="modal">
      <h2>Confirm Account Deletion</h2>
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>

      <div class="buttons">
        <button type="button" class="cancel-btn" on:click={() => showDeleteModal = false}>
          Cancel
        </button>
        <button type="button" class="delete-confirm-btn" on:click={deleteAccount} disabled={deleting}>
          {#if deleting}Deleting…{:else}Delete Account{/if}
        </button>
      </div>

      {#if error}
        <p class="feedback error">{error}</p>
      {/if}
    </div>
  {/if}
{:else}
  <h1>Loading…</h1>
{/if}

<style>
  /* Profile card */
  .profile-card {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .profile-card h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .bio {
    font-size: 1rem;
    color: #555;
    min-height: 1.5rem;
  }

  /* Form inputs */
  input[type="text"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  button {
    cursor: pointer;
    font-weight: 500;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    border: none;
    transition: background 0.2s;
  }

  /* Specific buttons */
  .logout-btn {
    background: #e53e3e;
    color: white;
  }
  .logout-btn:hover {
    background: #c53030;
  }

  .delete-btn {
    background: #f6adad;
    color: #721c24;
  }
  .delete-btn:hover {
    background: #f56565;
  }

  .delete-confirm-btn {
    background: #e53e3e;
    color: white;
  }
  .delete-confirm-btn:hover {
    background: #c53030;
  }

  .cancel-btn {
    background: #e2e8f0;
    color: #333;
  }
  .cancel-btn:hover {
    background: #cbd5e0;
  }

  .verify-btn {
    background: #3182ce;
    color: white;
  }
  .verify-btn:hover {
    background: #2b6cb0;
  }

  /* Feedback messages */
  .feedback {
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
  .feedback.error {
    color: #e53e3e;
  }
  .feedback.success {
    color: #38a169;
  }

  /* Form submit buttons */
  .update-bio-form button {
    background: #3182ce;
    color: white;
    width: 100%;
  }
  .update-bio-form button:hover {
    background: #2b6cb0;
  }

  /* Account actions container */
  .account-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  /* Modal */
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
    border-radius: 12px;
    z-index: 21;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>