<script>
  export let form = {};

  export let data;

  const user = data.user;
</script>

<h1>Questions and Answers</h1>

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

{#if data.questions.length === 0}
  <p>No questions found.</p>
{:else}
  {#each data.questions as q (q.id)}
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
            </div>
          {/each}
        </div>
      {:else}
        <p class="no-answers">No answers yet.</p>
      {/if}

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

    </div>
    <hr>
  {/each}
{/if}