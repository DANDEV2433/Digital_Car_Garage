// Importe Express pour créer une application web
const express = require("express");

// Importe CORS pour autoriser les requêtes entre front (localhost:3000) et back (localhost:PORT)
const cors = require("cors");

// Importe Morgan pour afficher les logs des requêtes HTTP dans le terminal
const morgan = require("morgan");

// Permet de gérer les chemins de fichiers (utile pour envoyer un fichier HTML)
const path = require("path");

// Permet de lire les cookies envoyés par le navigateur
const cookieParser = require("cookie-parser");

// Charge les variables d’environnement depuis .env (ex: PORT, DB config, etc.)
require('dotenv').config();

// Initialise l'application Express
const app = express();

// Active CORS pour permettre au frontend d'accéder à l'API backend
app.use(cors({
  origin: "http://localhost:3000", // Autorise uniquement les requêtes du frontend
  credentials: true                // Permet l'envoi de cookies/session entre les domaines
}));

// Active le parsing du corps des requêtes au format JSON
app.use(express.json());

// Permet de lire les cookies dans les requêtes entrantes
app.use(cookieParser());

// Active les logs HTTP (GET /login 200, etc.)
app.use(morgan("dev"));

// Monte les routes d'authentification sur /api/v1/auth (ex: /register, /login)
app.use("/api/v1/auth", require("./routes/auth.routes"));
// Monte les routes pour les utilisateurs sur /api/v1/users (ex: /users, /users/:id)
app.use("/api/v1/users", require("./routes/user.routes"));

// Monte les routes liées aux véhicules sur /api/v1 (ex: /vehicles, /vehicles/:id)
app.use("/api/v1/vehicles", require("./routes/vehicle.routes"));

// Monte les routes liées aux réparations sur /api/v1/repairs (ex: /repairs, /repairs/:id)
app.use("/api/v1/repairs", require("./routes/repair.routes"));

// Sert les fichiers statiques du frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../frontend")));

// Définit la route / qui renvoie le fichier login.html (page par défaut)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login/login.html"));
});


// Exporte l'app pour qu'elle puisse être utilisée ailleurs (ex: server.js ou les tests)
module.exports = app;
