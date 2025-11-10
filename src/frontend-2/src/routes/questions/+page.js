export async function load({ fetch }) {
  const res = await fetch('/api/allquestions');
  const data = await res.json();

  if (!data.ok) {
    throw new Error('Failed to fetch questions');
  }

  return {
    questions: data.allQuestionsResult
  };
}