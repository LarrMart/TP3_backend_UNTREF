-- Archivo de pruebas de consultas SQL

SELECT actor_id 
FROM actors AS a
WHERE a.name = 'Anya Taylor-Joy';

-- Crea una vista que devuelve los datos de forma similar
-- a como figura en el archivo edited-trailerflix.json
CREATE VIEW trailerflix AS
SELECT
	old_id AS id,
	poster,
	title AS titulo,
	concat("Película") AS categoria,
	
	(
		SELECT GROUP_CONCAT(g.name SEPARATOR ', ')
		FROM genres g
		INNER JOIN movies_genres mg 
		ON mg.genre_id = g.genre_id
		WHERE mg.movie_id = m.movie_id
	) AS genero,
	
	synopsis AS resumen,
	concat("N/A") AS temporadas,

	(
		SELECT GROUP_CONCAT(a.name SEPARATOR ', ')
		FROM actors a
		INNER JOIN movies_actors ma 
		ON ma.actor_id = a.actor_id
		WHERE ma.movie_id = m.movie_id
	) AS reparto,
	
	trailer
	
FROM
	movies m

	
UNION ALL

SELECT
	old_id AS id,
	poster,
	title AS titulo,
	concat("Serie") AS categoria,
	
	(
		SELECT GROUP_CONCAT(g.name SEPARATOR ', ')
		FROM genres g
		INNER JOIN tv_shows_genres tg 
		ON tg.genre_id = g.genre_id
		WHERE tg.tv_show_id = tv.tv_show_id
	) AS genero,
	
	synopsis AS resumen,
	seasons AS temporadas,
	
	(
		SELECT GROUP_CONCAT(a.name SEPARATOR ', ')
		FROM actors a
		INNER JOIN tv_shows_actors ta 
		ON ta.actor_id = a.actor_id
		WHERE ta.tv_show_id = tv.tv_show_id
	) AS reparto,
	
	
	trailer
		
FROM
	tv_shows tv
	
ORDER BY id;

-- -----------------------------------------------------------------------------------

SELECT 
    m.title,
	m.movie_id,
    GROUP_CONCAT(DISTINCT a.name ORDER BY a.name ASC SEPARATOR ', ') AS actores,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name ASC SEPARATOR ', ') AS generos
FROM 
    movies m
LEFT JOIN 
    movies_actors ma ON m.movie_id = ma.movie_id
LEFT JOIN 
    actors a ON ma.actor_id = a.actor_id
LEFT JOIN 
    movies_genres mg ON m.movie_id = mg.movie_id
LEFT JOIN 
    genres g ON mg.genre_id = g.genre_id
WHERE 
    m.title LIKE '%av%'
GROUP BY 
    m.movie_id;
	
	
	
	
SELECT
    p.id AS production_id,
    p.title AS production_title,
    CASE
        WHEN p.category = 'Película' THEN (
            SELECT GROUP_CONCAT(DISTINCT a.name ORDER BY a.name ASC SEPARATOR ', ')
            FROM actors a
            INNER JOIN movies_actors ma ON a.actor_id = ma.actor_id
            WHERE ma.movie_id = p.id
        )
        WHEN p.category = 'Serie' THEN (
            SELECT GROUP_CONCAT(DISTINCT a.name ORDER BY a.name ASC SEPARATOR ', ')
            FROM actors a
            INNER JOIN tv_shows_actors ta ON a.actor_id = ta.actor_id
            WHERE ta.tv_show_id = p.id
        )
    END AS actors,
    (
        SELECT GROUP_CONCAT(DISTINCT g.name ORDER BY g.name ASC SEPARATOR ', ')
        FROM genres g
        INNER JOIN movies_genres mg ON g.genre_id = mg.genre_id
        WHERE mg.movie_id = p.id
    ) AS genres
FROM
    (
        SELECT movie_id AS id, 'Película' AS category, title FROM movies
        UNION ALL
        SELECT tv_show_id AS id, 'Serie' AS category, title FROM tv_shows
    ) AS p
WHERE
    EXISTS (
        SELECT 1
        FROM genres g
        INNER JOIN (
            SELECT movie_id AS id, 'Película' AS category FROM movies
            UNION ALL
            SELECT tv_show_id AS id, 'Serie' AS category FROM tv_shows
        ) AS p2 ON g.genre_id = p2.id
        WHERE g.name = 'Ficción'
    );
	
	
	
SELECT table_name
FROM information_schema.columns
WHERE column_name = 'title'
  AND table_schema = 'audiovisual_productions';


SELECT a.name AS actor_name
FROM actors a
INNER JOIN movies_actors ma ON a.actor_id = ma.actor_id
INNER JOIN tv_shows_actors ta ON a.actor_id = ta.actor_id;

	
	

		
