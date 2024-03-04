-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS blacklist (
    token VARCHAR(755) NOT NULL PRIMARY KEY
); 