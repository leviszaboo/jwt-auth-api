-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    email_verified TINYINT DEFAULT 0
);


-- Create tokens table
CREATE TABLE IF NOT EXISTS blacklist (
    token VARCHAR(755) NOT NULL PRIMARY KEY
); 

