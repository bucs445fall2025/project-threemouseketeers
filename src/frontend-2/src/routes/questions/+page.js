/**
 * @brief calls the get all questions API endpoint when the page is loaded.
 *  
 * @returns questions to the page (data)
 */
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