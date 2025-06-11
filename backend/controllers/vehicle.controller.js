// Importe la connexion à la base de données (défini dans /models/db.js)
const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");

// Fonction appelée lors d’une requête POST pour ajouter un véhicule
exports.addVehicle = async (req, res) => {
  try {
    // Récupère les données du corps de la requête (formulaire)
    const {
      plate_number,
      brand,
      model,
      year,
      mileage
    } = req.body;

    // Récupère la photo si elle a été envoyée via le formulaire
    // Grâce à multer.memoryStorage(), elle est disponible dans req.file.buffer
    const photo = req.file ? req.file.buffer : null;

    if (!plate_number || !brand || !model || !year || !mileage) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Validation plaque d'immatriculation
    const licensePlateRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
    if (!licensePlateRegex.test(plate_number)) {
      return res.status(400).json({ message: "Format de la plaque invalide." });
    }
     // Vérifie que l'année est comprise entre 1886 et l'année actuelle
    const currentYear = new Date().getFullYear();
    if (year < 1886 || year > currentYear) {
      return res.status(400).json({ message: "Année invalide." });
    }
    // Vérifie que le kilométrage est un nombre positif
    if (mileage < 0) {
      return res.status(400).json({ message: "Kilométrage négatif." });
    }

    // Récupère l'ID de l'utilisateur depuis le token JWT (via middleware verifyToken)
    const userId = req.user.id;
    const garageId = req.user.id; // adapte selon ta logique métier

    // Génère un nouvel ID unique pour le véhicule
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    if (!garageId) {
      return res.status(400).json({ message: "Garage ID manquant." });
    }
    // Génère un UUID pour le véhicule  
    const id = uuidv4();

    // requête SQL pour insérer le véhicule dans la base de données 
    const sql = `
      INSERT INTO vehicles (
        id, plate_number, brand, model, year, mileage, photo, user_id, garage_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Exécute la requête SQL pour insérer le véhicule dans la base de données
    await db.query(sql, [
      id,
      plate_number,
      brand,
      model,
      year,
      mileage,
      photo,
      userId,
      garageId
    ]);

    res.status(201).json({ message: "Véhicule ajouté avec succès." });
  } catch (error) {
    console.error("Erreur ajout véhicule :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du véhicule." });
  }
};
