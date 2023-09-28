CREATE DATABASE audiovisual_productions 
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE audiovisual_productions;

CREATE TABLE movies (
	movie_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	synopsis TEXT NOT NULL,
	poster TEXT,
	trailer TEXT,
	old_id TINYINT UNSIGNED NOT NULL UNIQUE 
	-- Acá voy a guardar los valores que en el modelo NOSQL 
	-- figuran como id solo por motivos de debug
); 

CREATE TABLE tv_shows (
	tv_show_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	seasons TINYINT UNSIGNED NOT NULL,
	synopsis TEXT NOT NULL,
	poster TEXT,
	trailer TEXT,
	old_id TINYINT UNSIGNED NOT NULL UNIQUE 
	-- Acá voy a guardar los valores que en el modelo NOSQL 
	-- figuran como id solo por motivos de debug
);

CREATE TABLE actors (
	actor_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(80) NOT NULL
); 

CREATE TABLE genres (
	genre_id MEDIUMINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(40) NOT NULL
); 

CREATE TABLE movies_actors (
	movie_actor_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	movie_id INT UNSIGNED NOT NULL,
	actor_id INT UNSIGNED NOT NULL,
	FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
	FOREIGN KEY (actor_id) REFERENCES actors(actor_id)

); 

CREATE TABLE movies_genres (
	movie_genre_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	movie_id INT UNSIGNED NOT NULL,
	genre_id MEDIUMINT UNSIGNED NOT NULL,
	FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
	FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
); 

CREATE TABLE tv_shows_actors (
	tv_show_actor_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	tv_show_id INT UNSIGNED NOT NULL,
	actor_id INT UNSIGNED NOT NULL,
	FOREIGN KEY (tv_show_id) REFERENCES tv_shows(tv_show_id),
	FOREIGN KEY (actor_id) REFERENCES actors(actor_id)

); 

CREATE TABLE tv_shows_genres (
	tv_show_genre_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	tv_show_id INT UNSIGNED NOT NULL,
	genre_id MEDIUMINT UNSIGNED NOT NULL,
	FOREIGN KEY (tv_show_id) REFERENCES tv_shows(tv_show_id),
	FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
); 
