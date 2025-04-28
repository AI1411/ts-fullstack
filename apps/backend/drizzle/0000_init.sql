-- drop databases
DROP DATABASE IF EXISTS tsf;

-- create databases
CREATE DATABASE tsf;

-- create users table
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(64)         NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_unique UNIQUE (email)
);

-- create todos table
CREATE TABLE IF NOT EXISTS todos
(
    id         SERIAL PRIMARY KEY,
    user_id    INT REFERENCES users (id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    status     VARCHAR(64) DEFAULT 'PENDING',
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);