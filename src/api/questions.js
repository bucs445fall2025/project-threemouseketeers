require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;


const pool = mysql.createPool({
  host: DB_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * @brief Inserts a new question into the database
 *
 * Validates that the question text and topic ID are provided, then
 * stores the question with its author and associated topic.
 *
 * @param {*} newQuestion The text of the question
 * @param {*} username The username of the person asking
 * @param {*} topicId The ID of the topic/category the question belongs to
 * @returns An object containing { id, newQuestion, username, topicId }
 *
 * @throws Error(400) if the question text or topic ID is missing
 * @throws Any MySQL error from the insert operation
 */
async function addQuestion(newQuestion, username, topicId) {
	//ensure field is not blank
	if(!newQuestion) {
		const err = new Error('Question field is empty.')
		err.status = 400;
		throw err;
	}
  if (!topicId) {
		const err = new Error('Topic is required.');
		err.status = 400;
		throw err;
	}
	
	const [result] = await pool.execute(
		'INSERT INTO questions (question, username, topic_id) VALUES (?, ?, ?)',
		[newQuestion, username, topicId]
	);
	
	return {id: result.insertId, newQuestion, username, topicId}
}

/**
 * @brief Increments the vote counter for an answer
 * 
 * @param {*} answerId the ID of the answer receiving a vote
 * @returns true if the update succeeds
 * 
 * @throws 404 if the answer does not exist
 * @throws Any MySQL error during lookup or update
 */
async function vote(answerId) {
	//ensure answerId exists in questions table
	const [rows] = await pool.execute(
		'SELECT answer FROM answers WHERE id = ?',
		[answerId]
	);
	if(!rows.length) {
		const err = new Error('Answer ID not found in table.');
		err.status = 404;
		throw err;
	}
	
	//increment vote count for answer
	const [results] = await pool.execute(
		'UPDATE answers SET votes = votes + 1 WHERE id = ?',
		[answerId]
	);
	
	return true;
}

/**
 * @brief Submits an answer to a question.
 *
 * Ensures the referenced question exists, inserts a new answer, and
 * increments the question's answer count.
 *
 * @param {*} questionId The ID of the question being answered
 * @param {*} newAnswer The answer text
 * @param {*} username The user providing the answer
 * @returns true on success
 *
 * @throws 404 if the question does not exist
 * @throws Any MySQL error during insert or update
 */
async function answerQuestion(questionId, newAnswer, username) {
	//ensure questionId exists in questions table
	const [rows] = await pool.execute(
		'SELECT question FROM questions WHERE id = ?',
		[questionId]
	);
	if(!rows.length) {
		const err = new Error('Question ID not found in table.');
		err.status = 404;
		throw err;
	}
	
	const [results] = await pool.execute(
		'INSERT INTO answers (question_id, answer, username) VALUES (?, ?, ?)',
		[questionId, newAnswer, username]
	)
	
	const [update] = await pool.execute(
    'UPDATE questions SET num_answers = num_answers + 1 WHERE id = ?',
    [questionId]
  );
	
	return true;
}

/**
 * @brief Returns the top-voted questions above a specified vote threshold
 *
 * First validates that enough qualifying questions exist; if not, the
 * result count is reduced. Then fetches questions ordered by vote count.
 *
 * @param {*} numRows Maximum number of questions to return
 * @param {*} minVotes Minimum vote count required for inclusion
 * @returns An array of question rows
 *
 * @note If insufficient qualifying questions exist, numRows is reduced.
 */
async function topQuestions(numRows, minVotes) {
	//ensure there are enough questions with minimum amount of votes
	const [count] = await pool.execute(
		'SELECT COUNT(*) AS questionsCount FROM questions WHERE votes > ?',
		[minVotes]
	);
	if(count[0].questionsCount < numRows) {
		console.warn('Not enough popular questions in database.');
		numRows = count[0].questionsCount;
	}
	
	const [results] = await pool.execute(
		'SELECT * FROM questions ORDER BY votes DESC LIMIT ?',
		[numRows]
	);
	
	return results;
}

/**
 * @brief Retrieves all questions along with their topics and associated answers
 *
 * Performs a joined query across questions, topics, and answers tables,
 * then aggregates answers under the appropriate question objects.
 *
 * @param {*} numRows Maximum number of questions to return
 * @returns An array of question objects, each containing an answers array
 */
async function getAllQuestions(numRows) {
  // Get total number of questions
  const [count] = await pool.execute(
    'SELECT COUNT(*) AS questionsCount FROM questions'
  );

  if (count[0].questionsCount < numRows) {
    console.warn('Not enough questions in database.');
    numRows = count[0].questionsCount;
  }

  // Get all questions, their topics, and answers
  const [rows] = await pool.execute(`
    SELECT 
      q.id AS question_id,
      q.question,
      q.username AS question_user,
      q.votes AS question_votes,
      q.num_answers,
      q.accepted_answer_id,
      q.created_at,
      t.id AS topic_id,
      t.name AS topic_name,
      a.id AS answer_id,
      a.answer,
      a.username AS answer_user,
      a.votes AS answer_votes,
      a.accepted_answer
    FROM questions q
    LEFT JOIN topics t ON q.topic_id = t.id
    LEFT JOIN answers a ON q.id = a.question_id
    ORDER BY q.created_at DESC
  `);

  // Group answers under each question
  const questionsMap = new Map();

  for (const row of rows) {
    if (!questionsMap.has(row.question_id)) {
      questionsMap.set(row.question_id, {
        id: row.question_id,
        question: row.question,
        username: row.question_user,
        votes: row.question_votes,
        num_answers: row.num_answers,
        accepted_answer_id: row.accepted_answer_id,
        created_at: row.created_at,
        topic: row.topic_id ? { id: row.topic_id, name: row.topic_name } : null,
        answers: []
      });
    }

    if (row.answer_id) {
      questionsMap.get(row.question_id).answers.push({
        id: row.answer_id,
        answer: row.answer,
        username: row.answer_user,
        votes: row.answer_votes,
        accepted: !!row.accepted_answer
      });
    }
  }

  // Convert Map to array
  return Array.from(questionsMap.values()).map(q => ({
    ...q,
    answers: Array.isArray(q.answers) ? q.answers : Object.values(q.answers || {})
  }));
}

/**
 * @brief Searches for question using the given keyword(s)
 * 
 * @param {*} query the keyword(s) to search in the FULLTEXT element of the question table
 * @returns an array of matching question objects
 * 
 * @throws 400 if the query is empty
 */
async function searchQuestions(query) {
  if (!query) {
    const err = new Error("Search query is empty.");
    err.status = 400;
    throw err;
  }

  // Get questions + answers in one join
  const [rows] = await pool.execute(`
    SELECT 
      q.id AS question_id,
      q.question,
      q.username AS question_user,
      q.votes AS question_votes,
      q.num_answers,
      q.accepted_answer_id,
      q.created_at,
      t.id AS topic_id,
      t.name AS topic_name,
      a.id AS answer_id,
      a.answer,
      a.username AS answer_user,
      a.votes AS answer_votes,
      a.accepted_answer
    FROM questions q
    LEFT JOIN topics t ON q.topic_id = t.id
    LEFT JOIN answers a ON q.id = a.question_id
    WHERE MATCH(q.question) AGAINST(? IN NATURAL LANGUAGE MODE)
    ORDER BY q.votes DESC, a.votes DESC
  `, [query]);

  // Group answers under each question
  const questionsMap = new Map();

  for (const row of rows) {
    if (!questionsMap.has(row.question_id)) {
      questionsMap.set(row.question_id, {
        id: row.question_id,
        question: row.question,
        username: row.question_user,
        votes: row.question_votes,
        num_answers: row.num_answers,
        accepted_answer_id: row.accepted_answer_id,
        created_at: row.created_at,
        topic: row.topic_id ? { id: row.topic_id, name: row.topic_name } : null,
        answers: []
      });
    }

    if (row.answer_id) {
      questionsMap.get(row.question_id).answers.push({
        id: row.answer_id,
        answer: row.answer,
        username: row.answer_user,
        votes: row.answer_votes,
        accepted: !!row.accepted_answer
      });
    }
  }

  return Array.from(questionsMap.values());
}



async function test(){
	//testing suite not implemented
}

module.exports = { addQuestion, 
                   vote, 
                   answerQuestion, 
                   topQuestions, 
                   getAllQuestions, 
                   searchQuestions, };