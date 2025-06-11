// middleware/verifyToken.middleware.js

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupère le token dans le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou mal formé." });
    }

    // Extrait le token brut (sans le 'Bearer ')
    const token = authHeader.split(" ")[1];

    // Vérifie et décode le token avec la clé secrète du .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Stocke les infos utilisateur dans req.user pour l'utiliser plus tard
    req.user = decoded;

    next(); // Passe au middleware ou contrôleur suivant
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};
