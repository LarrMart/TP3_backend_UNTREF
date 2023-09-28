const { Router } = require("express");

const {
	getEveryProduction,
	getProductionByOldID,
	getProductionsByName,
	getProductionsByCategory,
	getProductionsByGenre,
	getMoviesByGenre,
	getMovieByName,
	getTvShowByName,
	getProductionsByActor,
	getCategories,
	getTvShowsByGenre
} = require("../controllers/controllers.get.js");

const routerGets = Router();

//------------------------ ENDPOINTS DEL PUNTO 3.c --------------------------------------

routerGets.get("/api/obtener/catalogo/pelicula/nombre/:nombre", getMovieByName);

routerGets.get("/api/obtener/catalogo/serie/nombre/:nombre", getTvShowByName);

routerGets.get("/api/obtener/catalogo/pelicula/genero/:genero", getMoviesByGenre);

routerGets.get("/api/obtener/catalogo/serie/genero/:genero", getTvShowsByGenre);

routerGets.get("/api/obtener/producciones/del/actor/:nombre", getProductionsByActor);

// ----------------- ENDPOINT DEL PUNTO 3.d  --------------------------------------

routerGets.get("/api/obtener/categorias", getCategories);

// ----------------- ENDPOINTS DEL PUNTO 3.e --------------------------------------- 

routerGets.get("/api/obtener/catalogo", getEveryProduction);

routerGets.get("/api/obtener/catalogo/id/:id", getProductionByOldID);

routerGets.get("/api/obtener/catalogo/nombre/:nombre", getProductionsByName);

routerGets.get("/api/obtener/catalogo/genero/:genero", getProductionsByGenre);

routerGets.get("/api/obtener/catalogo/categoria/:categoria", getProductionsByCategory);

module.exports = { routerGets };