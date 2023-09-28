#!/usr/bin/env node

/*
El propósito de este archivo es generar archivos auxiliares .json
que me van a servir para generar la base de datos.
*/

const fs = require('fs')

const createActorsFile = productions => {
	try {
		const actorList = [];
		let counter = 1;
		for(let prod of productions) {
			let actorsInTheProduction = prod.reparto.split(/, /g)
			for(let actor of actorsInTheProduction) {
				let actorID = {actor_id: counter, name: actor.trim()}
				if(!actorList.find(actor => actor.name === actorID.name)) {
					actorList.push(actorID);
					counter++
				}
					
			}
		}
		const jsonData = JSON.stringify(actorList, null, 2);
		const fileDescriptor = fs.openSync('actors.json', 'w');
        const fileContent = fs.writeFileSync(fileDescriptor, jsonData);
		fs.closeSync(fileDescriptor);
	} catch(error) {
		console.log(error);
	}
}

const createGenresFile = productions => {
	try {
		const genreList = [];
		let counter = 1;
		for(let prod of productions) {
			let genresInTheProduction = prod.genero.split(/, /g)
			for(let genre of genresInTheProduction) {
				let genreID = {genre_id: counter, name: genre.trim()}
				if(!genreList.find(genre => genre.name === genreID.name)) {
					genreList.push(genreID);
					counter++
				}
					
			}
		}
		const jsonData = JSON.stringify(genreList, null, 2);
		const fileDescriptor = fs.openSync('genres.json', 'w');
        const fileContent = fs.writeFileSync(fileDescriptor, jsonData);
		fs.closeSync(fileDescriptor);
	} catch(error) {
		console.log(error);
	}
}

const createMoviesFile = productions => {
	try {
		const movieList = [];
		let counter = 1;
		for(let prod of productions) {
			if(prod.categoria == "Película") {
				let poster = prod.poster === undefined ? null : prod.poster;
				let trailer = prod. trailer === undefined ? null : prod.trailer;
				let movie = {
					movie_id: counter,
					title: prod.titulo,
					synopsis: prod.resumen,
					poster: poster,
					trailer: trailer,
					old_id: prod.id
				}
				movieList.push(movie);
				counter++;
			}
		}
		const jsonData = JSON.stringify(movieList, null, 2);
		const fileDescriptor = fs.openSync('movies.json', 'w');
		const fileContent = fs.writeFileSync(fileDescriptor, jsonData);
		fs.closeSync(fileDescriptor);
	} catch(error) {
		console.log(error);
	}
}

const createSeriesFile = productions => {
	try {
		const serieList = [];
		let counter = 1;
		for(let prod of productions) {
			if(prod.categoria == "Serie") {
				let poster = prod.poster === undefined ? null : prod.poster;
				let trailer = prod. trailer === undefined ? null : prod.trailer;
				let serie = {
					tv_show_id: counter,
					title: prod.titulo,
					seasons: prod.temporadas,
					synopsis: prod.resumen,
					poster: poster,
					trailer: trailer,
					old_id: prod.id
				}
				serieList.push(serie);
				counter++;
			}
		}
		const jsonData = JSON.stringify(serieList, null, 2);
		const fileDescriptor = fs.openSync('tv-shows.json', 'w');
		const fileContent = fs.writeFileSync(fileDescriptor, jsonData);
		fs.closeSync(fileDescriptor);
	} catch(error) {
		console.log(error);
	}
}

const createSeriesGenresFile = series => {
	
	const seriesGenresElement = (serieGenreID, serieID, genreID) => {
		return {
			"tv_show_genre_id": serieGenreID,
			"tv_show_id": serieID,
			"genre_id": genreID
		}
	}
	
	try {
		
		const fileDescGenres = fs.openSync('genres.json', 'r');
		const fileContentGenres = fs.readFileSync("genres.json", "utf8");
		const genres = JSON.parse(fileContentGenres);
		fs.closeSync(fileDescGenres);
		
		
		let counter = 1;
		let serie_id = 1;
		let toFile = [];
		for(let serie of series) {
			
			let serieGenres = serie.genero.split(/, /g);
			for(let genre of serieGenres) {
				let genreInTvShow = genres.find(elem => elem.name === genre)
				toFile.push(seriesGenresElement(counter, serie_id, genreInTvShow.genre_id ));
				counter++;
			}
			serie_id++;
		}
		
		const jsonData = JSON.stringify(toFile, null, 2);
		const fileDescSeriesGenres = fs.openSync('tv-shows-genres.json', 'w');
		fs.writeFileSync(fileDescSeriesGenres, jsonData);
		fs.closeSync(fileDescSeriesGenres);
		
	} catch(error) {
		console.log(error);
	}
	
	
}

const createSeriesActorsFile = series => {
	
	const seriesActorsElement = (serieActorID, serieID, actorID) => {
		return {
			"tv_show_actor_id": serieActorID,
			"tv_show_id": serieID,
			"actor_id": actorID
		}
	}
	
	try {
		
		const fileDescActors = fs.openSync('actors.json', 'r');
		const fileContentActors = fs.readFileSync('actors.json', "utf8");
		const actors = JSON.parse(fileContentActors);
		fs.closeSync(fileDescActors);
		
		
		let counter = 1;
		let serie_id = 1;
		let toFile = [];
		for(let serie of series) {
			let serieActors = serie.reparto.split(/, /g);
			
			for(let actor of serieActors) {
				let actorOnTVShow = actors.find(elem => elem.name === actor);
				toFile.push(seriesActorsElement(counter, serie_id, actorOnTVShow.actor_id ));
				counter++;
			}
			serie_id++;
		}
		
		const jsonData = JSON.stringify(toFile, null, 2);
		const fileDescSeriesActors = fs.openSync('tv-shows-actors.json', 'w');
		fs.writeFileSync(fileDescSeriesActors, jsonData);
		fs.closeSync(fileDescSeriesActors);
				
	} catch(error) {
		console.log(error);
	}
	
	
}

const createMoviesGenresFile = movies => {
	
	const moviesGenresElement = (movieGenreID, movieID, genreID) => {
		return {
			"movie_genre_id": movieGenreID,
			"movie_id": movieID,
			"genre_id": genreID
		}
	}
	
	try {
		
		const fileDescGenres = fs.openSync('genres.json', 'r');
		const fileContentGenres = fs.readFileSync("genres.json", "utf8");
		const genres = JSON.parse(fileContentGenres);
		fs.closeSync(fileDescGenres);
		
		
		let counter = 1;
		let movie_id = 1;
		let toFile = [];
		for(let movie of movies) {
			let movieGenres = movie.genero.split(/, /g);
			for(let genre of movieGenres) {
				let genreOnMovie = genres.find(elem => elem.name === genre)
				toFile.push(moviesGenresElement(counter, movie_id, genreOnMovie.genre_id ));
				counter++;
			}
			movie_id++;
		}
		
		const jsonData = JSON.stringify(toFile, null, 2);
		const fileDescMoviesGenres = fs.openSync('movies-genres.json', 'w');
		fs.writeFileSync(fileDescMoviesGenres, jsonData);
		fs.closeSync(fileDescMoviesGenres);
		
		
		
	} catch(error) {
		console.log(error);
	}
	
	
}

const createMoviesActorsFile = movies => {
	
	const moviesActorsElement = (movieActorID, movieID, actorID) => {
		return {
			"movie_actor_id": movieActorID,
			"movie_id": movieID,
			"actor_id": actorID
		}
	}
	
	try {
		
		const fileDescActors = fs.openSync('actors.json', 'r');
		const fileContentActors = fs.readFileSync('actors.json', "utf8");
		const actors = JSON.parse(fileContentActors);
		fs.closeSync(fileDescActors);
		
		
		let counter = 1;
		let movie_id = 1;
		let toFile = [];
		for(let movie of movies) {
			let movieActors = movie.reparto.split(/, /g);
			
			for(let actor of movieActors) {
				let actorOnMovie = actors.find(elem => elem.name === actor);
				toFile.push(moviesActorsElement(counter, movie_id, actorOnMovie.actor_id ));
				counter++;
			}
			movie_id++;
		}
		
		const jsonData = JSON.stringify(toFile, null, 2);
		const fileDescMoviesActors = fs.openSync('movies-actors.json', 'w');
		fs.writeFileSync(fileDescMoviesActors, jsonData);
		fs.closeSync(fileDescMoviesActors);
		
		
		
	} catch(error) {
		console.log(error);
	}
	
	
}

const getPeliculas = (productions) => {
	return productions.filter(prod => prod.categoria === 'Película');
}

const getSeries = (productions) => {
	return productions.filter(prod => prod.categoria === 'Serie');
}

function main() {
	try {
		const fileDescriptor = fs.openSync('edited-trailerflix.json', 'r');
		const fileContent = fs.readFileSync("edited-trailerflix.json", "utf8");
		const productions = JSON.parse(fileContent);
		fs.closeSync(fileDescriptor);

		const series = getSeries(productions);
		const peliculas = getPeliculas(productions);
		
	
		createActorsFile(productions);
		createGenresFile(productions);
		createMoviesFile(productions);
		createSeriesFile(productions);
		createSeriesGenresFile(series);
		createSeriesActorsFile(series);	
		createMoviesGenresFile(peliculas);
		createMoviesActorsFile(peliculas);		
	
	} catch (error) {
		console.log(error);
	}
}

main();
