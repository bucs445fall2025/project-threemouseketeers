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

async function addQuestion(newQuestion, username) {
	//ensure field is not blank
	if(!newQuestion) {
		const err = new Error('Question field is empty.')
		err.status = 400;
		throw err;
	}
	
	const [result] = await pool.execute(
		'INSERT INTO questions (question, username) VALUES (?, ?)',
		[newQuestion, username]
	);
	
	return {id: result.insertId, newQuestion, username}
}

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

async function getAllQuestions(numRows) {
  // Get total number of questions
  const [count] = await pool.execute(
    'SELECT COUNT(*) AS questionsCount FROM questions'
  );

  if (count[0].questionsCount < numRows) {
    console.warn('Not enough questions in database.');
    numRows = count[0].questionsCount;
  }

  // Get all questions and their answers
  const [rows] = await pool.execute(`
    SELECT 
      q.id AS question_id,
      q.question,
      q.username AS question_user,
      q.votes AS question_votes,
      q.num_answers,
      q.accepted_answer_id,
      q.created_at,
      a.id AS answer_id,
      a.answer,
      a.username AS answer_user,
      a.votes AS answer_votes,
      a.accepted_answer
    FROM questions q
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

async function test(){
	//testing suite not implemented
}

module.exports = { addQuestion, vote, answerQuestion, topQuestions, getAllQuestions };