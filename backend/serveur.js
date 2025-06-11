const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ajoute Morgan pour logger les requêtes HTTP dans le terminal
app.use(morgan("dev"));
// Route pour l'API d'authentification
app.use("/api/v1/auth", require("./routes/auth.routes"));
// Route pour l'API d'ajout de véhicule
app.use("/api/v1/vehicle", require("./routes/vehicle.routes"));

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
