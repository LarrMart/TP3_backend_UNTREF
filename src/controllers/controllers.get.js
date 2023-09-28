let { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const {
	Response, 
	responses
} = require('../utilities/Response.js');

const utils = require('../utilities/utilities.js');

let { sequelize } = require('../models/models.js'); // Contiene los modelos ya inicializados
													// y asociados a él. 
const {                                             
	Actor,
	Genre,
	Movie,
	TvShow,	
} = require('../models/models.js');

// ----------------------------------------- INICIO FUNCIONES AUXILIARES --------------------------------------------
// En esta sección se encuentran funciones que son utilizadas por los controladores.


// Este método recibe los resultados de las consultas de los modelos a la base de datos.
// Su objetivo es:
/* 1. Convertir el arreglo de arreglos resultArrays en único arreglo de resultados.
   2. Ordenar por el id
   3. Darle la ruta absoluta al campo poster.*/
const formatResults = (...resultArrays) => {

		let ret = undefined;
		let productions = [];
		
		for(let arr of resultArrays) {
			if(arr !== null)
				productions = [...productions, ...arr];
		}

		productions.forEach(production => {
			production.poster = path.join(utils.getProjectRoot(), "src", production.poster);
		})

		productions.sort((a, b) => a.id - b.id);
		
		if(productions.length !== 0) {
			ret = new Response(productions, 200, {date: new Date(), records: productions.length});
		}

		return ret !== undefined ?	ret : responses("noMatches");
}

// Devuelve los atributos que va a ser utilizado por el modelo TvShow.
const getTvShowModelAttributes = () => {
	return [
      	['old_id', 'id'],
      	'poster',
        ['title', 'titulo'],
        [sequelize.literal("'Serie'"), 'categoria'],

        [
          sequelize.literal(
          	`(
          		SELECT GROUP_CONCAT(DISTINCT g.name ORDER BY g.name ASC SEPARATOR ", ") 
          		FROM genres g 
          		JOIN tv_shows_genres tg ON g.genre_id = tg.genre_id 
          		WHERE tg.tv_show_id = TvShow.tv_show_id
          	)`
          ),
          'genero',
        ],

        ['synopsis', 'resumen'],
        ['seasons', 'temporadas'],
        
        [
          sequelize.literal(
          	`(
          		SELECT GROUP_CONCAT(DISTINCT a.name ORDER BY a.name ASC SEPARATOR ", ") 
          		FROM actors a 
          		JOIN tv_shows_actors ta 
          		ON a.actor_id = ta.actor_id 
          		WHERE ta.tv_show_id = TvShow.tv_show_id
          	)`
          ),
          'reparto',
        ],

        'trailer'
  ]
}

// Devuelve los atributos que va a ser utilizado por el modelo Movie.
const getMovieModelAttributes = () => {
	return [
	      	['old_id', 'id'],
	      	'poster',
	        ['title', 'titulo'],
	        [sequelize.literal("'Película'"), 'categoria'],

	        [
	          sequelize.literal(`
	          	(
	          		SELECT GROUP_CONCAT(DISTINCT g.name ORDER BY g.name ASC SEPARATOR ", ") 
	          		FROM genres g 
	          		JOIN movies_genres mg 
	          		ON g.genre_id = mg.genre_id 
	          		WHERE mg.movie_id = Movie.movie_id
	          	)`
	          ), 
	          'generos',
	        ],

	        ['synopsis', 'resumen'],

	        [
	          sequelize.literal(`
	          	(
	          		SELECT GROUP_CONCAT(DISTINCT a.name ORDER BY a.name ASC SEPARATOR ", ") 
	          		FROM actors a 
	          		JOIN movies_actors ma 
	          		ON a.actor_id = ma.actor_id 
	          		WHERE ma.movie_id = Movie.movie_id
	          	)`
	          ), 
	          'reparto'
	        ],

	        'trailer' 
	      ];
}

const getTvShows = async () => {
	try {
		const tvShows = await TvShow.findAll({
      attributes: getTvShowModelAttributes() 
  	});

		return tvShows;
	} catch(error) {
		console.log(error);
	}
}

const getMovies = async () => {
	try {
		const movies = await Movie.findAll({
	      attributes: getMovieModelAttributes()   
	  });
		return movies;
	} catch(error) {
		console.log(error);
	}
}

const retrieveMovieByName = async (name) => {
	try {
		const movies = await Movie.findAll({
      attributes: getMovieModelAttributes(),
      where: {
        title: {
          [Sequelize.Op.like]: `%${name}%`,
        }
      },
      include: [
        {
          model: Actor,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: Genre,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      group: ['Movie.movie_id'],
    });
    return movies;
	} catch(error) {
		throw new Error("ERROR EN retrieveMovieByName" + error);
	}
}

const retrieveTvShowByName = async (name) => {
	try {
		const tvShows = await TvShow.findAll({
      attributes: getTvShowModelAttributes(),
      where: {
        title: {
          [Sequelize.Op.like]: `%${name}%`,
        }
      },
      include: [
        {
          model: Actor,  
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: Genre,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
      group: ['TvShow.tv_show_id'],
    });

    return tvShows;
	} catch(error) {
		throw new Error("ERROR EN retrieveTvShowByName");
	}
}

const retrieveMoviesByGenre = async (genre) => {
	try {
		const movies = await Movie.findAll({
      attributes: getMovieModelAttributes(),
      include: [
        {
          model: Genre,
          attributes: [],
          through: {
            attributes: [],
          },
          where: {
            name: `${genre}`,
          },
        },
      ]
    });

    return movies;
	} catch(error) {
		console.log(error);
	}
}

const retrieveTvShowsByGenre = async (genre) => {
	try {
		const tvShows = await TvShow.findAll({
      attributes: getTvShowModelAttributes(),
      include: [
        {
          model: Genre,
          attributes: [],
          through: {
            attributes: [],
          },
          where: {
            name: `${genre}`,
          },
        },
      ]
    });
    return tvShows;
	} catch(error) {
		console.log(error);
	}
}


// ----------------------------------------- FIN FUNCIONES AUXILIARES ------------------------------------------------ 


// ----------------------------------------- INICIO CONTROLADORES ----------------------------------------------------

// Controladores del punto 3.c
const getMovieByName = async (req, res) => {
	let ret = undefined;
  try {
  	const name = req.params.nombre;
		let movies = await retrieveMovieByName(name);
		movies = movies.map(movie => movie.dataValues);

		ret = formatResults(movies);
  } catch (error) {
  	console.log(error);
    ret = responses("connectionFailed");
  } finally {
  	res.status(ret.status).json(ret);
  }
}

const getTvShowByName = async (req, res) => {
  let ret = undefined;
  try {
  	console.log("HOLA ACÁ ESTOY");
  	const name = req.params.nombre;
		const tvShows = await retrieveTvShowByName(name);

		ret = formatResults(tvShows);
  } catch (error) {
  	console.log(error);
    ret = responses("connectionFailed");
  } finally {
  	res.status(ret.status).json(ret);
  }

}

const getMoviesByGenre = async (req, res) => {
	let ret = undefined;                                
	try {
		const genre = req.params.genero;
    const movies = await retrieveMoviesByGenre(genre);

    ret = formatResults(movies.map(movie => movie.dataValues));
    if(ret.status === 404)
    	ret.info += " El género especificado no existe.";
    	 
	} catch(error) {
		ret = responses("connectionFailed");
		console.log(error);
	} finally {
		res.status(ret.status).json(ret);
	}
}

const getTvShowsByGenre = async (req, res) => {
	let ret = undefined;                                
	try {
		const genre = req.params.genero;
    const tvShows = await retrieveTvShowsByGenre(genre);

    ret = formatResults(tvShows.map(tvShow => tvShow.dataValues));
    if(ret.status === 404)
    	ret.info += " El género especificado no existe.";
    	 
	} catch(error) {
		ret = responses("connectionFailed");
		console.log(error);
	} finally {
		res.status(ret.status).json(ret);
	}
}

const getProductionsByActor = async (req, res) => {
	let ret = responses("noMatches");
  try {
  	const actorName = req.params.nombre;
    const actor = await Actor.findOne({
      where: { name: actorName },
      include: [
        {
          model: Movie,
          attributes: [
          	['old_id', 'id'],
          	['title', 'titulo'],
          	['synopsis', 'resumen'],
          	'poster',
          	'trailer'
          ],
          through: { attributes: [] }, 
        },
        {
          model: TvShow,
          attributes: [
          	['old_id', 'id'],
          	['title', 'titulo'],
          	['synopsis', 'resumen'],
          	['seasons', 'temporadas'],
          	'poster',
          	'trailer'
          ],
          through: { attributes: [] }, // Evita que se incluyan columnas de la tabla pivot
        },
      ],
    });
    productions = [];
    
    if(actor !== null) {
    	actor.Movies.forEach((movie) => productions.push(movie));
    	actor.TvShows.forEach((tvShow) => productions.push(tvShow));
    	ret = formatResults(productions.map(prod => prod.dataValues));
    }
    
  } catch (error) {
    console.log(error);
    ret = responses("connectionFailed");
  } finally {
  	res.status(ret.status).json(ret);
  }
}

// Controlador del punto 3.d 
const getCategories = async (req, res) => {
	let ret = undefined;
	try {
		const [result] = await sequelize.query(
			'SELECT IF(table_name = "movies", "Película", "Serie") AS table_name FROM production_types'
		);
		let categories = result.map(elem => elem.table_name);
		ret = new Response(categories, 200, {date: new Date(), records: categories.length});
		
	} catch(error) {
		ret = responses("connectionFailed");
	} finally {
		res.status(ret.status).json(ret);
	}
}

// Controladores del punto 3.e
const getEveryProduction = async (req, res) => {
	let ret = undefined; // Supongo que no puedo conectar

	try {
		const [resultSet] = await sequelize.query('SELECT * FROM trailerflix');
		let values = resultSet.map(elem => {
			if (elem.trailer === null)
				delete elem.trailer;       				// En la base de datos las producciones
			return elem;				                // que no tienen trailer figuran con el valor de null
		});								                // en cambio en el archivo edited-trailerflix 
		  												// no existe la propiedad, asi que la elimino
		ret = formatResults(values);        																								;
	} catch(error) {
		 console.log(error);
		 ret = responses("connectionFailed");
	} finally {
		res.status(ret.status).json(ret); // Se devuelve el resultado o el mensaje de error.
	}
}

const getProductionByOldID = async (req, res) => {
	let ret = responses("wrongId");       // Supongo que el id enviado es incorrecto:
	try {								  // número no positivo o una palabra.    
		let id = parseInt(req.params.id);  
		
		if(id && id > 0) {
			ret = responses("noMatches");        // Si el id es correcto, supongo que no hay coincidencias 
			
			const movie = await Movie.findOne({
	      attributes: getMovieModelAttributes(),
	      where: {
	        old_id: id,
	      }
	    });

	    if(movie) {                      // El id que se envió coincide con una película    	
	    	ret = formatResults([movie]);
	    } else {
	    	const tv_show = await TvShow.findOne({
		      attributes: getTvShowModelAttributes(),
		      where: {
		        old_id: id,
		      },
	    	});

	    	if(tv_show) {                   // El id que se envió coincide con una serie
	    		ret = formatResults([tv_show]);
	    	}

	    }
			
		}
 
		
	} catch(error) {
		ret = responses("connectionFailed");
		console.log(error);
	} finally {
		res.json(ret);
	}
	
}

const getProductionsByName = async (req, res) => {
	let ret = undefined; 
	try {
		const name = req.params.nombre;
		const movies = await retrieveMovieByName(name);
		const tvShows = await retrieveTvShowByName(name);
		
		ret = formatResults(
			movies.map(movie => movie.dataValues), 
			tvShows.map(tvShow => tvShow.dataValues)
		);	
    
	} catch(error) {
		ret = responses('connectionFailed');
		console.log(error);
	} finally {
		res.status(ret.status).json(ret);
	}
}

const getProductionsByGenre = async (req, res) => {
	let ret = undefined;                                
	try {
		const genre = req.params.genero;
    	const movies = await retrieveMoviesByGenre(genre);
    	const tvShows = await retrieveTvShowsByGenre(genre);

    ret = formatResults(
		movies.map(movie => movie.dataValues), 
		tvShows.map(tvShow => tvShow.dataValues)
	);	
    if(ret.status == 404)
    	ret.info += " El género especificado no existe.";

	} catch(error) {
		ret = responses("connectionFailed");
		console.log(error);
	} finally {
		res.status(ret.status).json(ret);
	}
}

const getProductionsByCategory = async (req, res) => {
	let ret = responses("wrongCategory"); // De entrada supongo que la categoria enviada es erronea
	try {
		let category = req.params.categoria;
		let regExp = /(^pel[ií]culas?$|^series?$)/gi;
		
		if(regExp.test(category)) {            //Solo se acepta que la categoria sea película o serie
			 let productions = /pel[ií]cula/gi.test(category) ? 
			   await getMovies() : await getTvShows();
			 
			 ret = formatResults(productions.map(prod => prod.dataValues));
		}
		
	} catch(error) {
		ret = responses("connectionFailed");
	} finally {
		res.status(ret.status).json(ret);
	}
}

module.exports = {
	getEveryProduction,
	getProductionByOldID,
	getProductionsByName,
	getProductionsByCategory,
	getProductionsByGenre,
	getMovies,
	getMoviesByGenre,
	getTvShowsByGenre,
	getTvShows,
	getMovieByName,
	getTvShowByName,
	getProductionsByActor,
	getCategories
}

