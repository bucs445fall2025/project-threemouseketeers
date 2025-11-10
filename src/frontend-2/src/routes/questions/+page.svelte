<script>
  export let form = {};

  export let data;

  const user = data.user;
</script>

<h1>Questions and Answers</h1>

{#if user}
  <h2>Post/Answer goes here</h2>
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
    {#if form?.success}
      <p style="color:green">Asked Successfully!</p>
    {/if}
  </form>
{:else}
  <h2>Please log in to ask/answer questions</h2>
{/if}

{#if data.questions.length === 0}
  <p>No questions found.</p>
{:else}
  {#each data.questions as q (q.question_id)}
    <div class="question">
      <h2>{q.question}</h2>
      <p>
        Asked by <strong>{q.question_user}</strong> • 
        Votes: {q.question_votes} • 
        Posted: {new Date(q.created_at).toLocaleString()}
      </p>

      {#if q.answer_id}
        <div class="answers">
          <h3>Answers</h3>
          <div class="answer">
            <p>{q.answer}</p>
            <small>
              — {q.answer_user} ({q.answer_votes} votes)
              {#if q.accepted_answer}
                <span style="color: green;">✔ Accepted</span>
              {/if}
            </small>
          </div>
        </div>
      {:else}
        <p class="no-answers">No answers yet.</p>
      {/if}
    </div>
    <hr>
  {/each}
{/if}