const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Route pour l'enregistrement d'un nouvel utilisateur
router.post("/register", authController.register);

// Route pour la connexion d'un utilisateur
router.post("/login", authController.login);

module.exports = router;
