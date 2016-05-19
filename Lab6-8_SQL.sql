-- Begin lab 6 --
DROP TABLE IF EXISTS genre_lookup;
DROP TABLE IF EXISTS location_lookup;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS movie_rating;

CREATE TABLE movie (movie_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(100));

CREATE TABLE location_lookup(movie_id INT, location VARCHAR(100) ,
FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE, 
PRIMARY KEY(movie_id, location));

CREATE TABLE genre_lookup (movie_id INT, genre VARCHAR(50),
FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE, 
PRIMARY KEY(movie_id, genre));

CREATE TABLE account(account_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100), first_name VARCHAR(50), last_name VARCHAR(50));

CREATE TABLE movie_rating(rating_id INT PRIMARY KEY AUTO_INCREMENT, account_id INT, movie_id INT, rating FLOAT,
UNIQUE(movie_id, account_id));


SELECT username, COUNT(rating_id) AS ratings FROM account a
JOIN movie_rating r ON a.account_id = r.account_id
GROUP BY r.account_id;

SELECT username, SUM(rating) / COUNT(rating_id) AS average_rating FROM account a
JOIN movie_rating r ON r.account_id = a.account_id
GROUP BY r.account_id;

SELECT m.movie_id, title, SUM(rating) / COUNT(rating_id) AS average_rating FROM movie m
JOIN movie_rating r ON r.movie_id = m.movie_id
GROUP BY r.account_id;

CREATE OR REPLACE VIEW movie_avg_rating AS
(
	SELECT m.movie_id, title, SUM(rating) / COUNT(rating_id) AS average_rating FROM movie m
	JOIN movie_rating r ON r.movie_id = m.movie_id
	GROUP BY r.account_id
);

DROP PROCEDURE IF EXISTS get_greater_ratings;
DELIMITER //
	CREATE PROCEDURE get_greater_ratings(_average FLOAT)
    
    BEGIN
    
		SELECT title, average_rating FROM movie_avg_rating
		WHERE average_rating > _average;
    
	END//
DELIMITER ;

DROP PROCEDURE IF EXISTS user_greater_ratings;
DELIMITER //
	CREATE PROCEDURE user_greater_ratings(_average FLOAT)
    
    BEGIN
    
		SELECT username, SUM(rating) / COUNT(rating_id) AS average_rating FROM account a
		JOIN movie_rating r ON r.account_id = a.account_id
		WHERE average_rating > _average
        GROUP BY a.account_id;
    
	END//
DELIMITER ;

DROP FUNCTION IF EXISTS movie_rating;
DELIMITER //
	CREATE FUNCTION movie_rating(_movie_id INT) RETURNS FLOAT
    
    BEGIN
    
		DECLARE rating FLOAT;
		SELECT SUM(rating) / COUNT(rating_id) INTO rating FROM movie_rating
		WHERE movie_id = _movie_id
        GROUP BY movie_id;
        
		RETURN rating;
	END//
DELIMITER ;

DROP FUNCTION IF EXISTS user_rating;
DELIMITER //
	CREATE FUNCTION user_rating(_user_id INT) RETURNS FLOAT
    
    BEGIN
    
		DECLARE rating FLOAT;
		SELECT SUM(rating) / COUNT(rating_id) INTO rating FROM movie_rating
		WHERE user_id = _user_id
        GROUP BY muser_id;
        
		RETURN rating;
	END//
DELIMITER ;

-- END Lab 6 --


-- Begin lab 7 --

# All users that have rated a movie
SELECT username FROM account WHERE EXISTS (SELECT account_id FROM movie_rating where account_id = account_id);

SELECT username FROM account WHERE account_id IN (SELECT account_id FROM movie_rating r where r.account_id = account_id);

# All users that have not rated a movie
SELECT username FROM account WHERE NOT EXISTS (SELECT account_id FROM movie_rating r where r.account_id = account_id);

SELECT username FROM account WHERE account_id NOT IN (SELECT account_id FROM movie_rating r where r.account_id = account_id);

SELECT a.account_id, r.movie_id, rating FROM account a
LEFT JOIN movie_rating r ON a.account_id = r.account_id;

SELECT title, SUM(rating) / COUNT(rating_id) AS average_rating FROM movie m
JOIN movie_rating r ON r.movie_id = m.movie_id
GROUP BY m.title;

SELECT SUM(r.rating) / COUNT(r.rating_id) AS avg_genre FROM movie_rating r
JOIN genre_lookup g ON r.movie_id = g.movie_id
GROUP BY genre;

SELECT a.account_id, username, SUM(rating) / COUNT(rating_id) AS average_rating FROM account a
JOIN movie_rating r ON r.account_id = a.account_id
GROUP BY account_id
ORDER BY average_rating DESC, username ASC;

(SELECT username, SUM(r.rating) / COUNT(r.rating_id) AS average FROM account a
JOIN movie_rating r ON r.account_id = a.account_id
GROUP BY a.account_id 
ORDER BY average DESC
LIMIT 3)
UNION ALL 
(SELECT username, SUM(r.rating) / COUNT(r.rating_id) AS average FROM account a
JOIN movie_rating r ON r.account_id = a.account_id
GROUP BY a.account_id 
ORDER BY average ASC
LIMIT 3)
ORDER BY average; 

SELECT DISTINCT a.username FROM movie_rating r
JOIN account a ON a.account_id = r.account_id;

DROP TABLE IF EXISTS account_avg_rating;
CREATE TABLE account_avg_rating (username VARCHAR(100) PRIMARY KEY, avg_rating FLOAT);
INSERT INTO  account_avg_rating (username, avg_rating)
SELECT username, average_rating FROM 
(SELECT username, SUM(rating) / COUNT(rating_id) AS average_rating FROM account a
JOIN movie_rating r ON r.account_id = a.account_id
GROUP BY a.account_id
ORDER BY average_rating DESC, username ASC) a;

UPDATE account_avg_rating 
LEFT JOIN 
	(SELECT username, SUM(rating) / COUNT(rating_id) AS average_rating FROM account a
	JOIN movie_rating r ON r.account_id = a.account_id
	GROUP BY a.account_id
	ORDER BY average_rating DESC, username ASC) a
ON account_avg_rating.username = a.username
SET avg_rating = a.average_rating;


# Practice with the movie table

DROP TABLE IF EXISTS movie_average_rating;
CREATE TABLE movie_average_rating (title VARCHAR(50) PRIMARY KEY, avg_rating FLOAT);
INSERT INTO movie_average_rating (title, avg_rating) 
SELECT title, average_rating FROM 
	(SELECT title, SUM(rating) / COUNT(rating_id) AS average_rating FROM movie m
	JOIN movie_rating r ON r.movie_id = m.movie_id
    GROUP BY m.movie_id
    ORDER BY average_rating DESC, title ASC) a;

SELECT * FROM movie_average_rating;



UPDATE movie_average_rating
LEFT JOIN 
	(SELECT title, SUM(rating) / COUNT(rating_id) AS average FROM movie m
	JOIN movie_rating r ON r.movie_id = m.movie_id
    GROUP BY m.movie_id
    ORDER BY average DESC, title ASC) a
ON movie_average_rating.title = a.title
SET avg_rating = a.average;

SELECT * FROM movie_average_rating;



DELETE FROM movie_average_rating
WHERE NOT EXISTS 
	(SELECT * FROM movie WHERE 
    title = movie_average_rating.title);
SELECT * FROM movie_average_rating;

DELETE FROM movie_average_rating
WHERE title NOT IN
	(SELECT title FROM movie WHERE 
    title = movie_average_rating.title);
SELECT * FROM movie_average_rating;



INSERT INTO movie_average_rating (title, avg_rating)
SELECT title, average FROM
	(SELECT title, SUM(rating) / COUNT(rating_id) AS average FROM movie m
	JOIN movie_rating r ON r.movie_id = m.movie_id 
    GROUP BY m.movie_id) a
		WHERE NOT EXISTS 
        (SELECT * FROM movie_average_rating b
        WHERE a.title = b.title);
        
SELECT * FROM movie_average_rating;

DROP PROCEDURE IF EXISTS update_movie_rating;
DELIMITER //
	CREATE PROCEDURE update_movie_rating()
    
    BEGIN
    
    UPDATE movie_average_rating
	LEFT JOIN 
		(SELECT title, SUM(rating) / COUNT(rating_id) AS average FROM movie m
		JOIN movie_rating r ON r.movie_id = m.movie_id 
		GROUP BY m.movie_id
		ORDER BY average DESC, title ASC) a
	ON movie_average_rating.title = a.title
	SET avg_rating = a.average;
    INSERT INTO movie_average_rating (title, avg_rating)
	SELECT title, average FROM
		(SELECT title, SUM(rating) / COUNT(rating_id) AS average FROM movie m
		JOIN movie_rating r ON r.movie_id = m.movie_id 
		GROUP BY m.movie_id) a
			WHERE NOT EXISTS 
			(SELECT * FROM movie_average_rating b
			WHERE a.title = b.title);
            
	END//
DELIMITER ;

CALL update_movie_rating;


