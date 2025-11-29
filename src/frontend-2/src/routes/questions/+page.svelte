<script>
  export let form = {};

  export let data;

  let query = "";

  const user = data.user;

  let questions = data.questions;

  async function voteAnswer(questionId, answerId) {
    try {
      const res = await fetch(`/api/voteanswer`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'},
        body: JSON.stringify({ answerId })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Optimistically update vote count on frontend
        const question = questions.find(q => q.id === questionId);
        const aIndex = question.answers.findIndex(a => a.id === answerId);

        if (aIndex !== -1) {
          // If backend returned updated answer object, use it; otherwise increment locally
          if (data?.answer) {
            question.answers[aIndex] = { ...question.answers[aIndex], ...data.answer };
          } else {
            // safe increment: ensure votes is a number
            question.answers[aIndex].votes = (Number(question.answers[aIndex].votes) || 0) + 1;
          }
        } else if (data?.answer) {
          // answer not present locally but server returned it => add it
          q.answers.push(data.answer);
        } else {
          console.warn('Answer not found locally and server did not return updated answer');
        }

        // reassignment makes the page reactive 
        questions = [...questions];
      }
      else {
        console.warn("Could note vote for answer successfully");
      }
    } catch (err) {
      console.error('Vote for answer failed:', err);
    }
  }

  let loading = false;
	let error = "";

  async function search() {
		if (!query.trim()) return;

    loading = true
		error = "";

        try {
            const res = await fetch('/api/searchquestions', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query })
            });

            const data = await res.json();
            questions = data.results || [];

        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
	}

</script>

<h1>Questions and Answers</h1>

<div class="search">
	<input
		type="text"
		bind:value={query}
		placeholder="Search questions…"
		on:keydown={(e) => e.key === 'Enter' && search()}
	/>

	<button on:click={search}>Search</button>
</div>

{#if loading}
	<p>Searching…</p>
{:else if error}
	<p class="error">{error}</p>
{:else if questions.length === 0 && query}
	<p>No results found.</p>
{/if}


{#if user}
  <form method="POST">
    <input name="username" type="hidden" value={user.username}/>
    <input name="question" type="text" placeholder="Ask a question..."/>
    <button type="submit", formaction="?/askQuestion">Ask</button>

    {#if form?.missing}
      <p style="color:red">Please fill in all fields.</p>
    {/if}
    {#if form?.apiError}
      <p style="color:red">{form.apiError}</p>
    {/if}
  </form>
{:else}
  <h2>Please log in to ask/answer questions</h2>
{/if}

{#if questions.length === 0}
  <p>No questions found.</p>
{:else}
  {#each questions as q (q.id)}
    <div class="question">
      <h2>{q.question}</h2>
      <p>
        Asked by <strong>{q.username}</strong> • 
        Votes: {q.votes} • 
        Posted: {new Date(q.created_at).toLocaleString()}
      </p>

      {#if q.answers.length > 0}
        <div class="answers">
        <h3>Answers</h3>
          {#each q.answers as a}
            <div class="answer">
              <p>{a.answer}</p>
              <small>
                — {a.username} ({a.votes} votes)
                {#if a.accepted}
                  <span style="color: green;">✔ Accepted</span>
                {/if}
              </small>
              {#if data.user}
                <button on:click={() => voteAnswer(q.id, a.id)}>Vote</button>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <p class="no-answers">No answers yet.</p>
      {/if}

      {#if data.user}
        <form method="POST">
          <input name="username" type="hidden" value={user.username}/>
          <input name="questionID" type="hidden" value={q.id}>
          <input name="answer" type="text" placeholder="Submit an answer..."/>
          <button type="submit", formaction="?/answerQuestion">Answer</button>

          {#if form?.missing}
            <p style="color:red">Please fill in all fields.</p>
          {/if}
          {#if form?.apiError}
            <p style="color:red">{form.apiError}</p>
          {/if}
        </form>
      {/if}

    </div>
    <hr>
  {/each}
{/if}