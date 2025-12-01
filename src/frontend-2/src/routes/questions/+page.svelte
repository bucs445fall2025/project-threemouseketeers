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

{#if user}
  <div class="ask-btn-container">
    <button class="ask-btn" on:click={() => showAskModal = true}>Ask a Question</button>
  </div>

  {#if showAskModal}
    <div class="modal-backdrop" on:click={() => showAskModal = false}></div>
    <div class="modal">
      <h2 class="question-title">Ask a Question</h2>
      <form method="POST">
        <input type="hidden" name="username" value={user.username} />

        <label>
          Question:
          <input type="text" name="question" placeholder="Type your question..." bind:value={askQuestionText} required />
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
          <button type="button" on:click={() => showAskModal = false} class="cancel-btn">Cancel</button>
          <button type="button" on:click={submitQuestion} class="submit-btn">Submit</button>
        </div>

        {#if form?.missing}<p class="error">Please fill in all fields.</p>{/if}
        {#if form?.apiError}<p class="error">{form.apiError}</p>{/if}
      </form>
    </div>
  {/if}
{:else}
  <h2>Please log in to ask/answer questions</h2>
{/if}

<h1>Questions and Answers</h1>

<h2> Filter by Topic: </h2>
<div class="topic-bar">
  <button 
    class:selected={pageSelectedTopic === "all"} 
    on:click={() => { pageSelectedTopic = "all"; filterByTopic(); }}
  >All</button>

  {#each topics as t}
    <button 
      class:selected={pageSelectedTopic == t.id} 
      on:click={() => { pageSelectedTopic = t.id; filterByTopic(); }}
    >{t.name}</button>
  {/each}
</div>

<h2> Or, Search by Keyword: </h2>
<div class="search-bar">
  <input
    type="text"
    bind:value={query}
    placeholder="Search questions…"
    on:keydown={(e) => e.key === 'Enter' && search()}
  />
  <button on:click={search} class="small-btn-search">Search</button>
</div>

{#if loading}
  <p>Searching…</p>
{:else if error}
  <p class="error">{error}</p>
{:else if questions.length === 0 && query}
  <p>No results found.</p>
{/if}

{#if filteredQuestions.length === 0}
  <p>No questions found for this topic{#if selectedTopic !== "all"}: {topics.find(t => t.id == selectedTopic)?.name}{/if}.</p>
{:else}
  {#each filteredQuestions as q (q.id)}
    <div class="question">
      <h2 class="question-title">{q.question}</h2>
      <p class="meta">
        Asked by <strong>{q.username}</strong> • Posted: {new Date(q.created_at).toLocaleString()}
      </p>

      {#if q.answers?.length > 0}
        <div class="answers">
          <h3>Answers</h3>
          {#each q.answers as a}
            <div class="answer">
              <div class="answer-content">
                <p>{a.answer}</p>
                <small>
                  — {a.username} ({a.votes} votes)
                  {#if a.accepted}<span class="accepted">✔ Accepted</span>{/if}
                </small>
                {#if data.user}
                  <button class="vote-btn" on:click={() => voteAnswer(q.id, a.id)}>👍</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="no-answers">No answers yet.</p>
      {/if}

      {#if data.user}
        <form method="POST" class="answer-form-large">
          <input name="username" type="hidden" value={user.username}/>
          <input name="questionID" type="hidden" value={q.id} />

          <label class="answer-label">
            Submit an answer:
            <textarea name="answer" placeholder="Type your answer..." required></textarea>
          </label>

          <button type="submit" formaction="?/answerQuestion" class="small-btn">Answer</button>

          {#if form?.missing}<p class="error">Please fill in all fields.</p>{/if}
          {#if form?.apiError}<p class="error">{form.apiError}</p>{/if}
        </form>
      {/if}
    </div>
  {/each}
{/if}

<style>
  /* Topic bar */
  .topic-bar {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
    scrollbar-width: thin;
  }

  .topic-bar::-webkit-scrollbar {
    height: 6px;
  }

  .topic-bar::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  .topic-bar button {
    color: grey;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #f0f0f0;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
  }

  .topic-bar button:hover {
    background: green;
    color: white;
    border-color: #3182ce;
  }

  .topic-bar button.selected {
    background: darkgreen;
    color: white;
    border-color: #3182ce;
  }
  /* Search */
  .search-bar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.search-bar input[type="text"] {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

  /* Questions */
  .question {
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 1rem;
    background: #fff;
  }

  .question h2 {
    margin-top: 0;
  }

  .meta {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  .answers {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 2px solid #3182ce;
  }

  .answer {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.answer-content {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.vote-btn {
  all: unset;
  display: inline-block !important;
  padding: 0.25rem 0.5rem !important;
  font-size: 0.75rem !important;
  border-radius: 4px !important;
  border: 1px solid #3182ce !important;
  background: #fff !important;
  color: #3182ce !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  text-align: center !important;
}

.vote-btn:hover {
  background: #3182ce !important;
  color: white !important;
}

  .accepted {
    color: #38a169;
    font-weight: bold;
    margin-left: 0.3rem;
  }

  .answer-form-large {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.5rem;

  }

  .answer-label {
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .answer-label textarea {
    flex: 1;
    min-height: 2rem;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    resize: vertical;
  }

  .small-btn {
    padding: 0.35rem 0.7rem;  
    font-size: 0.85rem;
    border-radius: 6px;
    border: none;
    background: darkgreen;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    align-self: flex-end;
  }

  .small-btn:hover {
    background: rgb(14, 132, 14);
  }

  .small-btn-search {
    width: fit-content;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    border-radius: 6px;
    border: none;
    background: darkgreen;
    color: white;
    cursor: pointer;
  }

  .small-btn-search:hover {
    background: rgb(14, 132, 14);
  }

  /* Ask button */
  .ask-btn-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  .ask-btn {
    width: 20%;
    padding: 0.6rem 1.2rem;
    background: #38a169;
    color: white;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .ask-btn:hover {
    background: #2f855a;
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
    max-width: 500px;
    border-radius: 12px;
    z-index: 21;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .modal h2 {
    margin-top: 0;
  }
  label {
    display: block;
    margin-top: 1rem;
    font-weight: 500;
  }
  input[type="text"], select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  .buttons button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }
  .submit-btn { background: #3182ce; color: white; }
  .submit-btn:hover { background: #2c5282; }
  .cancel-btn { background: #e2e8f0; color: #333; }
  .cancel-btn:hover { background: #cbd5e0; }

  .question-title {
    color: darkgreen;
  }

  .error { color: #e53e3e; margin-top: 0.25rem; font-size: 0.9rem; }
</style>
