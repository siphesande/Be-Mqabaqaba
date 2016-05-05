# NOTE: RUN $ mysql --local-infile -u <user> -p BEFORE EXECUTING THIS SCRIPT
DROP DATABASE IF EXISTS mqabaqaba;
CREATE DATABASE mqabaqaba;
#CREATE USER user@localhost IDENTIFIED BY 'password';
#GRANT ALL PRIVILEGES ON mqabaqaba.* TO user@localhost;
#FLUSH PRIVILEGES;

USE mqabaqaba;

CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(40),
  completed INT,
  points INT,
  status INT
  #password VARCHAR(100),
);

INSERT INTO users (name) VALUES ("Lusando"),("Eugene");

UPDATE users
SET completed = 0,
    points = 0,
    status = 0;

CREATE TABLE challenge_types(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(20)
);

INSERT INTO challenge_types (description) VALUES ("social"),("exercise"),("both");

CREATE TABLE user_challenges(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT,
  date DATE,
  time TIME,
  challenge_id INT,
  recurring INT
);

CREATE TABLE  challenges(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  description VARCHAR(1000),
  type_id INT,
  time_limit INT,
  distance INT
  #requirements VARCHAR(1000)
);

LOAD DATA LOCAL INFILE "../data/challenges.csv" INTO TABLE challenges
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(description, type_id, time_limit, distance);
