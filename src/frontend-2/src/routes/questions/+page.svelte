<script>
  export let data;

  console.log(data);
</script>

<h1>Questions and Answers</h1>

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