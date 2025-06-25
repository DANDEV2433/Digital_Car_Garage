const mysql = require('mysql2/promise');
require('dotenv').config();
// Configuration de la connexion à la base de données MySQL
// createPool pour gérer les connexions multiples
// Utilisation de mysql2/promise pour les promesses et async/await
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
