// Este archivo tiene la finalidad de inicializar los modelos
// para luego ser exportados hacia el archivo que tiene los controladores

const dbConnectionData = {
  host     : process.env.HOST,
  port     : process.env.PORT,
  username : process.env.DB_USER,
  password : process.env.PASSWORD,
  database : process.env.DB_NAME,
  dialect  : process.env.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

const utils = require('../utilities/utilities.js');

const mysql = require('mysql2');

const { Sequelize, DataTypes } = require('sequelize');
let sequelize = new Sequelize(dbConnectionData);

const path = require('path');
const fs = require('fs');


// --------------------------------------- INICIO DEFINICIÓN DE MODELOS ------------------------------------------ 

const Actor = sequelize.define('Actor', {
  actor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false
  }
}, {
  tableName: 'actors',
  timestamps: false
});

const Genre = sequelize.define('Genre', {
  genre_id: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false
  }
}, {
  tableName: 'genres',
  timestamps: false
});

const Movie = sequelize.define('Movie', {
  movie_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  poster: {
    type: DataTypes.TEXT
  },
  trailer: {
    type: DataTypes.TEXT
  },
  old_id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'movies',
  timestamps: false
});

const TvShow = sequelize.define('TvShow', {
  tv_show_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  seasons: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  poster: {
    type: DataTypes.TEXT
  },
  trailer: {
    type: DataTypes.TEXT
  },
  old_id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tv_shows',
  timestamps: false
});

const MovieActor = sequelize.define('MovieActor', {
  movie_actor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  movie_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'movies',
      key: 'movie_id'
    }
  },
  actor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'actors',
      key: 'actor_id'
    }
  }
}, {
  tableName: 'movies_actors',
  timestamps: false 
});

const MovieGenre = sequelize.define('MovieGenre', {
  movie_genre_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  movie_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'movies',
      key: 'movie_id'
    }
  },
  genre_id: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'genres',
      key: 'genre_id'
    }
  }
}, {
  tableName: 'movies_genres', 
  timestamps: false 
});

const TvShowActor = sequelize.define('TvShowActor', {
  tv_show_actor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  tv_show_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'tv_shows',
      key: 'tv_show_id'
    }
  },
  actor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'actors',
      key: 'actor_id'
    }
  }
}, {
  tableName: 'tv_shows_actors',
  timestamps: false 
});

const TvShowGenre = sequelize.define('TvShowGenre', {
  tv_show_genre_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  tv_show_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'tv_shows',
      key: 'tv_show_id'
    }
  },
  genre_id: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'genres',
      key: 'genre_id'
    }
  }
}, {
  tableName: 'tv_shows_genres',
  timestamps: false
});

// ------------------------------------------- FIN DEFINICIÓN DE MODELOS -----------------------------------


// El método "initialize" tiene la finalidad de crear la base datos si esta no existe.
// Lo hace mediante el conector mysql de nodejs ya que desde sequelize no se puede.
// Si las tablas no existen también se crean y se llenan. 
// Además se establecen las asociaciones entre los modelos.

async function initialize() {         
   
  const JSONfilePaths = path.join(utils.getProjectRoot(), "src/database");
  const files = [
              'actors.json',
              'genres.json',
              'movies.json',
              'tv-shows.json',
              'movies-actors.json',
              'movies-genres.json',
              'tv-shows-genres.json',
              'tv-shows-actors.json',
  ];
  async function createDatabase() {
      // Utilizo la conexión mysql para poder crear la base de datos.
      const connection = mysql.createConnection(
        {
          host: process.env.HOST,
          user: process.env.DB_USER,
          password: process.env.PASSWORD,
        }
      );
      try {
        await connection.promise().query('CREATE DATABASE IF NOT EXISTS audiovisual_productions;');
        console.log('Base de datos "audiovisual_productions" creada exitosamente.');
      } catch (error) {
        console.error('Error al crear la base de datos:', error);
      } finally {
        connection.end(); 
      }
  }
  async function loadFileOnDatabase(fileName, model) {
        try {
          const rutaArchivo = path.join(JSONfilePaths, fileName);
          const contenido = fs.readFileSync(rutaArchivo, 'utf8');
          const datos = JSON.parse(contenido);
          
          await model.bulkCreate(datos);
          console.log(`Datos del archivo ${fileName} insertados en la base de datos.`);
        } catch (error) {
          console.error(`Error al cargar el archivo ${fileName}: ${error}`);
        }
  }
  async function loadFilesOnDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida con éxito.');

      for (const file of files) {
        let model;
        
        // Asigna el modelo correspondiente según el nombre del archivo
        switch (file) {
          case 'actors.json':
            model = Actor;
            break;
          case 'genres.json':
            model = Genre;
            break;
          case 'movies.json':
            model = Movie;
            break;
          case 'tv-shows.json':
            model = TvShow;
            break;
          case 'movies-actors.json':
            model = MovieActor;
            break;
          case 'movies-genres.json': 
            model = MovieGenre;
            break;
          case 'tv-shows-genres.json':
            model = TvShowGenre;
            break;
          case 'tv-shows-actors.json':
            model = TvShowActor;
            break;
          default:
            console.log(`No se encontró un modelo correspondiente para el archivo ${archivo}.`);
            continue;
        }

      await loadFileOnDatabase(file, model);
      
    }

      // await loadViewTrailerflix();
      // await loadViewProductionType();
      setAssociations();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  } finally {

    console.log('Conexión a la base de datos cerrada.');
  }
  }
  async function loadViewTrailerflix() {
    
    try {
      const Trailerflix = await sequelize.query(  
      `
      CREATE VIEW trailerflix AS 
      SELECT * FROM (
        SELECT
          old_id AS id,
          poster,
          title AS titulo,
          CONCAT('Película') AS categoria,
          (
            SELECT GROUP_CONCAT(g.name SEPARATOR ', ')
            FROM genres g
            INNER JOIN movies_genres mg ON mg.genre_id = g.genre_id
            WHERE mg.movie_id = m.movie_id
          ) AS genero,
          synopsis AS resumen,
          CONCAT('N/A') AS temporadas,
          (
            SELECT GROUP_CONCAT(a.name SEPARATOR ', ')
            FROM actors a
            INNER JOIN movies_actors ma ON ma.actor_id = a.actor_id
            WHERE ma.movie_id = m.movie_id
          ) AS reparto,
          trailer
        FROM movies m
        UNION ALL
        SELECT
          old_id AS id,
          poster,
          title AS titulo,
          CONCAT('Serie') AS categoria,
          (
            SELECT GROUP_CONCAT(g.name SEPARATOR ', ')
            FROM genres g
            INNER JOIN tv_shows_genres tg ON tg.genre_id = g.genre_id
            WHERE tg.tv_show_id = tv.tv_show_id
          ) AS genero,
          synopsis AS resumen,
          seasons AS temporadas,
          (
            SELECT GROUP_CONCAT(a.name SEPARATOR ', ')
            FROM actors a
            INNER JOIN tv_shows_actors ta ON ta.actor_id = a.actor_id
            WHERE ta.tv_show_id = tv.tv_show_id
          ) AS reparto,
          trailer
        FROM tv_shows tv
      ) AS trailerflix
      ORDER BY id;
      `
    );

     
    } catch(error) {
      console.log(error,"Ocurrió un error al crear la vista.");
    }
    
  }
  async function loadViewProductionType() { 
    try {
      const createViewSQL = `
        CREATE VIEW production_types AS
          SELECT table_name                   
          FROM information_schema.columns
          WHERE column_name = 'title'
            AND table_schema = 'audiovisual_productions';  
      `;
      await sequelize.query(createViewSQL);
      
      console.log('Vista creada exitosamente.');
    } catch(error) {
      console.log(error);
    }
  }
  function setAssociations() {
    Movie.belongsToMany(Genre, { through: 'movies_genres', foreignKey: 'movie_id' });
    Genre.belongsToMany(Movie, { through: 'movies_genres', foreignKey: 'genre_id' });
    Movie.belongsToMany(Actor, { through: 'movies_actors', foreignKey: 'movie_id' });
    Actor.belongsToMany(Movie, { through: 'movies_actors', foreignKey: 'actor_id' });

    TvShow.belongsToMany(Genre, { through: 'tv_shows_genres', foreignKey: 'tv_show_id' });
    Genre.belongsToMany(TvShow, { through: 'tv_shows_genres', foreignKey: 'genre_id' });
    TvShow.belongsToMany(Actor, { through: 'tv_shows_actors', foreignKey: 'tv_show_id' });
    Actor.belongsToMany(TvShow, { through: 'tv_shows_actors', foreignKey: 'actor_id' });  
  }  

  try {
    await createDatabase();
    await sequelize.sync(); // creo las tablas si estas no existen.
    const rows = await Actor.count();
    
    if(rows == 0) { // Si las tablas están vacías, se cargan.
      
      await loadFilesOnDatabase();
      await loadViewTrailerflix();
      await loadViewProductionType();
      setAssociations();
    } else {
      setAssociations();
    }     
  } catch (error) {
    console.log("Ocurrió un error al configurar la base de datos" + error);
  }
} 
 
initialize();

module.exports = {
  Actor,
  Genre,
  Movie,
  TvShow,
  MovieActor,
  MovieGenre,
  TvShowActor,
  TvShowGenre,
  sequelize
};

