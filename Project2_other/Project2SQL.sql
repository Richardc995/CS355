
CREATE OR REPLACE VIEW game_info_view AS (
	SELECT title, genre, platform, release_date, game_id, publisher_name FROM video_game v
    left JOIN publisher p ON v.publisher_id = p.publisher_id
);

CREATE OR REPLACE VIEW user_info_view AS (
	SELECT first_name, last_name, email FROM user
);


CREATE TABLE user (user_id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(50) UNIQUE, 
first_name VARCHAR(50), last_name VARCHAR(50), passkey VARCHAR(50));

INSERT INTO user (email, first_name, last_name, passkey) VALUES 
('TestUser1', 'Test', 'Testy', 'password'), ('TestUser2', 'Testa', 'Testy', 'password');

CREATE TABLE rating (user_id INT, game_id INT, rating FLOAT, comment VARCHAR(200));

INSERT INTO rating (user_id, game_id, rating, comment) VALUES 
(1, 1, 7.0, 'yay '), (1, 2, 8.0, 'yay'), (2, 1, 4.0, 'nay'), (2, 2, 6.5, 'meh');

ALTER TABLE publisher ADD COLUMN about VARCHAR(150) DEFAULT 'No info recorded' NOT NULL;

DROP FUNCTION IF EXISTS get_publisher_name;
DELIMITER //
CREATE FUNCTION get_publisher_name(_name VARCHAR(100)) RETURNS INT
BEGIN
	DECLARE _id INT;
	SELECT publisher_id INTO _id FROM publisher WHERE publisher_name = _name;
	RETURN _id;
END //
DELIMITER ;

