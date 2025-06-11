const express = require("express");
const router = express.Router();
// Importe Multer (outil pour gérer les fichiers envoyés via formulaire HTML)
const multer = require("multer");
// Importe le contrôleur qui contient la logique pour ajouter un véhicule
const vehicleController = require("../controllers/vehicle.controller");
// Configure Multer pour stocker les fichiers en mémoire (RAM)
const storage = multer.memoryStorage();
// Initialise Multer avec le stockage en mémoire
// Cela permet de récupérer le fichier dans req.file.buffer
const upload =  multer({ storage });
// Importe le middleware de vérification du token JWT
const verifyToken = require("../middleware/verifyToken.middleware");



// Ajouter un véhicule (avec photo)
router.post("/vehicles", verifyToken, upload.single("photo"), vehicleController.addVehicle);

module.exports = router;