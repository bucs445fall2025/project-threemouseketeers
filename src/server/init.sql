CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(255) DEFAULT 'No information given.',
  verified INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS questions (
	id INT AUTO_INCREMENT PRIMARY KEY,
	question VARCHAR(255) NOT NULL,
	username VARCHAR(50) NOT NULL,
	votes INT DEFAULT 0,
	num_answers INT DEFAULT 0,
	accepted_answer_id INT DEFAULT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  topic_id INT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);


CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE FULLTEXT INDEX ft_questions_question ON questions(question);

INSERT INTO topics (name) VALUES
('campus'),
('food'),
('student life'),
('academics'),
('sports'),
('logistics');

-- TODO: add tables for media

CREATE TABLE IF NOT EXISTS answers (
	id INT AUTO_INCREMENT PRIMARY KEY,
	question_id INT NOT NULL,
	answer VARCHAR(255) NOT NULL,
	username VARCHAR(50) NOT NULL,
	votes INT DEFAULT 0,
	accepted_answer BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS email_tokens (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	token VARCHAR(128) NOT NULL UNIQUE,
	expires_at DATETIME NOT NULL,
	used TINYINT(1) NOT NULL DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES users(id)
)