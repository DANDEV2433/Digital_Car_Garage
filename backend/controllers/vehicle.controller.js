// Importe la connexion à la base de données
const db = require("../models/db");
// Importe le module pour générer des UUID
const { v4: uuidv4 } = require("uuid");
// fonction pour ajouter un véhicule
exports.addVehicle = async (req, res) => {
  try {
    const { plate_number, brand, model, year, mileage, client_email} = req.body;
    //  Récupérer la photo envoyée dans le formulaire (champ <input type="file">)
    //  et la convertir en données binaires (Buffer) pour l’enregistrer en base.
    const photo = req.file ? req.file.buffer : null;

    // Vérifications de base
    if (!plate_number || !brand || !model || !year || !mileage || !client_email) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Vérifie la plaque d'immatriculation
    const licensePlateRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
    // Ex: AB-123-CD
    if (!licensePlateRegex.test(plate_number)) {
      return res.status(400).json({ message: "Format de la plaque invalide." });
    }

    // Vérifie l'année, new Date().getFullYear() pour l'année actuelle
    const currentYear = new Date().getFullYear();
    if (year < 1886 || year > currentYear) {
      return res.status(400).json({ message: "Année invalide." });
    }

    // Vérifie le kilométrage
    if (mileage < 0) {
      return res.status(400).json({ message: "Kilométrage négatif." });
    }

    // Récupération de l'ID utilisateur depuis le token JWT (authentification middleware)
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    // Cherche le garage lié à cet utilisateur
    const [garageRows] = await db.query(
      "SELECT id FROM Garage WHERE user_id = ?",
      [userId]
    );

    if (garageRows.length === 0) {
      return res.status(403).json({ message: "Aucun garage associé à cet utilisateur." });
    }
    // Récupération de l'ID du garage
    const garageId = garageRows[0].id;
    // Récupération de l'ID du client via son email
const [clientRows] = await db.query(
  "SELECT id FROM User WHERE email = ? AND role_id = '7cbe8a66-4566-11f0-99ef-00155dba5cee'",
  [client_email]
);

if (clientRows.length === 0) {
  return res.status(404).json({ message: "Client introuvable avec cet email." });
}
// Récupération de l'ID du client
const clientId = clientRows[0].id;

    // Génère l'ID du véhicule
    const id = uuidv4();

    // Requête SQL d'insertion du véhicule avec les données fournies
    const sql = `
      INSERT INTO Vehicles (
        id, plate_number, brand, model, year, mileage, photo, client_id, garage_id
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
      clientId,
      garageId,
    ]);

    res.status(201).json({ message: "Véhicule ajouté avec succès." });

  } catch (error) {
    console.error("Erreur ajout véhicule :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du véhicule." });
  }
};
// fonction pour récupérer tous les véhicules d'un garage lié à un utilisateur connecté
exports.getAllVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    // Récupération de l'ID du garage de l'utilisateur
    const [garageRows] = await db.query(
      "SELECT id FROM Garage WHERE user_id = ?",
      [userId]
    );
    if (garageRows.length === 0) {
      return res.status(403).json({ message: "Aucun garage associé à cet utilisateur." });
    }
    // Récupération de l'ID du garage
    const garageId = garageRows[0].id;
    const [rows] = await db.query(
      // récupérer tous les véhicules d’un garage, avec le nom, prénom du client pour chaque véhicule.
      // On utilise un JOIN pour lier la table Vehicles avec la table User
      // Pour chaque véhicule v, trouve l’utilisateur u dont l'identifiant correspond à v.client_id.
      `SELECT v.*, u.last_name AS client_nom, u.first_name AS client_prenom
      FROM Vehicles v
      JOIN User u ON v.client_id = u.id
      WHERE v.garage_id = ?`,
      [garageId]
    );

    // Conversion des photos en base64 si elles existent pour les envoyer en frontend
    // On utilise toString('base64') pour convertir le Buffer en chaîne base64
    const vehicules = rows.map(v => ({
      ...v,
      photo: v.photo ? v.photo.toString('base64') : null,
    }));

    res.json(vehicules);
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// fonction pour récupérer les véhicules d'un utilisateur connecté
exports.getVehiclesByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      
      `SELECT v.*, u.last_name AS client_nom, u.first_name AS client_prenom
       FROM Vehicles v
       JOIN User u ON v.client_id = u.id
       WHERE v.client_id = ?`,
      [userId]
    );

    const vehicules = rows.map(v => ({
      ...v,
      photo: v.photo ? v.photo.toString("base64") : null,
    }));

    res.json(vehicules);

  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules par utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
