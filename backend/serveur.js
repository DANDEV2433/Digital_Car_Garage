// Importe Express (utile ici si tu veux ajouter un middleware localement, mais pas obligatoire)
const express = require("express");
// Importe Open pour ouvrir le navigateur automatiquement
const open = require("open");

// Permet de gérer les requêtes entre domaines (Cross-Origin Resource Sharing)
const cors = require("cors");

// Logger de requêtes (ex: GET /api/v1/auth/login 200)
const morgan = require("morgan");

// Gère les chemins de fichiers (utile pour envoyer les fichiers frontend)
const path = require("path");

// Lit les cookies dans les requêtes entrantes
const cookieParser = require("cookie-parser");

// Charge les variables d’environnement (.env)
require("dotenv").config();

// Le vrai app est importé ici (app configurée dans app.js)
const app = require("./app");

// Définit le port sur lequel le serveur va écouter
const PORT = process.env.PORT || 3000;

// Lance le serveur et écoute les requêtes entrantes
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}/login/login.html`);
});
