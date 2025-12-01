<script>
  export let form = {};

  export let data;

  let query = "";

  const user = data.user;

  const topics = [
  { id: 1, name: "campus" },
  { id: 2, name: "food" },
  { id: 3, name: "student life" },
  { id: 4, name: "academics" },
  { id: 5, name: "sports" },
  { id: 6, name: "logistics" }
];

  let askQuestionText = "";
  let selectedTopic = "";
  let showAskModal = false;

  let questions = data.questions;

  async function submitQuestion() {
  if (!askQuestionText.trim() || !selectedTopic) return;

  try {
    const res = await fetch('/api/askquestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        question: askQuestionText,
        topic_id: selectedTopic
      })
    });

    const data = await res.json();
    if (res.ok) {
      questions = [data, ...questions]; // add new question locally
      showAskModal = false;
      askQuestionText = '';
      selectedTopic = '';

    } else {
      console.error(data.error);
    }
  } catch (err) {
    console.error(err);
  }
}


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
        filteredQuestions = [...questions];
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
            filteredQuestions = data.results || [];

        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
	}

  let pageSelectedTopic = "all";
  let filteredQuestions = questions;

  function filterByTopic() {
    if (pageSelectedTopic === "all") {
      filteredQuestions = questions;
    } else {
      filteredQuestions = questions.filter(
        q => q.topic?.id == pageSelectedTopic
      );
    }
  }


</script>

<h1>Questions and Answers</h1>

<div class="topic-bar">
  <button 
    class:selected={pageSelectedTopic === "all"} 
    on:click={() => { pageSelectedTopic = "all"; filterByTopic(); }}
  >
    All
  </button>

  {#each topics as t}
    <button 
      class:selected={pageSelectedTopic == t.id} 
      on:click={() => { pageSelectedTopic = t.id; filterByTopic(); }}
    >
      {t.name}
    </button>
  {/each}
</div>

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

<!-- TODO: Move answering question to a separate page/popup (allows for better control over (potential) titling, category selection, etc.) -->

{#if user}
  <button class="ask-btn" on:click={() => showAskModal = true}>
    Ask a Question
  </button>
  {#if showAskModal}
  <div class="modal-backdrop" on:click={() => showAskModal = false}></div>

  <div class="modal">
    <h2>Ask a Question</h2>

    <form method="POST">
      <input type="hidden" name="username" value={user.username} />

      <label>
        Question:
        <input
          type="text"
          name="question"
          placeholder="Type your question..."
          bind:value={askQuestionText}
          required
        />
      </label>

      <label>
        Topic:
        <select name="topic_id" bind:value={selectedTopic} required>
          <option value="">Select a topic…</option>
          {#each topics as t}
            <option value={t.id}>{t.name}</option>
          {/each}
        </select>
      </label>

      <div class="buttons">
        <button type="button" on:click={() => showAskModal = false}>
          Cancel
        </button>

        <button type="button" on:click={submitQuestion}>Submit</button>

      </div>

      {#if form?.missing}
        <p class="error">Please fill in all fields.</p>
      {/if}
      {#if form?.apiError}
        <p class="error">{form.apiError}</p>
      {/if}
    </form>
  </div>
{/if}

{:else}
  <h2>Please log in to ask/answer questions</h2>
{/if}

{#if filteredQuestions.length === 0}
  <p>No questions found for this topic{#if selectedTopic !== "all"}: {topics.find(t => t.id == selectedTopic)?.name}{/if}.</p>
{:else}
  {#each filteredQuestions as q (q.id)}
    <div class="question">
      <h2>{q.question}</h2>
      <p>
        Asked by <strong>{q.username}</strong> • 
        Votes: {q.votes} • 
        Posted: {new Date(q.created_at).toLocaleString()}
      </p>

      {#if q.answers?.length > 0}
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
          <button type="submit" formaction="?/answerQuestion">Answer</button>

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


<style>
  .ask-btn {
    padding: 0.6rem 1.1rem;
    background: #2b6cb0;
    color: white;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .ask-btn:hover {
    background: #2c5282;
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
    max-width: 500px;
    border-radius: 8px;
    z-index: 21;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }

  .modal h2 {
    margin-top: 0;
  }

  label {
    display: block;
    margin: 1rem 0;
  }

  input[type="text"], select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.3rem;
  }

  .buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .error {
    margin-top: 0.5rem;
    color: red;
  }
</style>