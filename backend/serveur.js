// Charge les variables d’environnement (.env)
require("dotenv").config();

// Importe l'application Express configurée
const app = require("./app");

// Définit le port sur lequel le serveur va écouter
const PORT = process.env.PORT || 3000;

// Lance le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Landing page: http://localhost:${PORT}/`);
  console.log(`Application: http://localhost:${PORT}/frontend/login/login.html`);
});
