const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());
// Ajoute Morgan pour logger les requêtes HTTP dans le terminal
app.use(morgan("dev"));
// Route pour l'API d'authentification
app.use("/api/v1/auth", require("./routes/auth.routes"));
// Route pour l'API d'ajout de véhicule
app.use("/api/v1", require("./routes/vehicle.routes"));
// Sert le frontend (HTML, JS, CSS, images)
app.use(express.static(path.join(__dirname, "../frontend")));
// Redirige / vers login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login/login.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
