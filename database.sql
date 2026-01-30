CREATE DATABASE launchpad;
USE launchpad;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role ENUM('dev','recruiter','admin')
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(100),
  tech VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email,password,role) VALUES
('dev@launchpad.com','1234','dev'),
('recruiter@launchpad.com','1234','recruiter'),
('admin@launchpad.com','1234','admin');
