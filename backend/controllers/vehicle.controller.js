// Importe la connexion à la base de données
const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");

exports.addVehicle = async (req, res) => {
  try {
    const { plate_number, brand, model, year, mileage } = req.body;
    const photo = req.file ? req.file.buffer : null;

    // 🧪 Vérifications de base
    if (!plate_number || !brand || !model || !year || !mileage) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // 🚗 Vérifie la plaque d'immatriculation
    const licensePlateRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
    if (!licensePlateRegex.test(plate_number)) {
      return res.status(400).json({ message: "Format de la plaque invalide." });
    }

    // 📅 Vérifie l'année
    const currentYear = new Date().getFullYear();
    if (year < 1886 || year > currentYear) {
      return res.status(400).json({ message: "Année invalide." });
    }

    // 📏 Vérifie le kilométrage
    if (mileage < 0) {
      return res.status(400).json({ message: "Kilométrage négatif." });
    }

    // 🔐 Récupération de l'ID utilisateur depuis le token JWT
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    // 🧲 Cherche le garage lié à cet utilisateur
    const [garageRows] = await db.query(
      "SELECT id FROM Garage WHERE user_id = ?",
      [userId]
    );

    if (garageRows.length === 0) {
      return res.status(403).json({ message: "Aucun garage associé à cet utilisateur." });
    }

    const garageId = garageRows[0].id;

    // 🆔 Génère l'ID du véhicule
    const id = uuidv4();

    // 📥 Requête SQL d'insertion
    const sql = `
      INSERT INTO vehicles (
        id, plate_number, brand, model, year, mileage, photo, user_id, garage_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      id,
      plate_number,
      brand,
      model,
      year,
      mileage,
      photo,
      userId,
      garageId,
    ]);

    res.status(201).json({ message: "Véhicule ajouté avec succès." });

  } catch (error) {
    console.error("Erreur ajout véhicule :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du véhicule." });
  }
};