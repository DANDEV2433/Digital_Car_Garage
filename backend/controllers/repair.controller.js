// Importe la connexion à la base de données
const db = require("../models/db");
// Importe le module pour générer des UUID
const { v4: uuidv4 } = require("uuid");

// function qui permet de créer une réparation pour un véhicule
exports.createRepair = async (req, res) => {
  const { vehicleId } = req.params;
  const { repair_date, description, mileage, cost } = req.body;

  try {
    // Vérification des champs obligatoires
    if (!repair_date || !description || !mileage || !cost) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    // Vérifier si le véhicule existe
    const [vehicleRows] = await db.query("SELECT * FROM Vehicles WHERE id = ?", [vehicleId]);
    if (vehicleRows.length === 0) {
      return res.status(404).json({ message: "Véhicule introuvable." });
    }

    // Générer un UUID pour la réparation
    const repairId = uuidv4();

    // Insertion dans la base de données
    await db.query(
      `INSERT INTO Repairs (id, vehicle_id, repair_date, description, mileage, cost)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [repairId, vehicleId, repair_date, description, mileage, cost]
    );

    res.status(201).json({ message: "Réparation ajoutée avec succès." });

  } catch (err) {
    console.error("Erreur lors de l'ajout de la réparation :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Fonction pour récupérer toutes les réparations d'un véhicule
exports.getRepairsByVehicle = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM Repairs WHERE vehicle_id = ?", [vehicleId]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des réparations :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Fonction pour mettre à jour une réparation existante
exports.updateRepair = async (req, res) => {
  const { repairId } = req.params;
  const { repair_date, description, mileage, cost } = req.body;

  try {
    // Vérification des champs obligatoires
    if (!repair_date || !description || !mileage || !cost) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    // Vérifier si la réparation existe
    const [repairRows] = await db.query("SELECT * FROM Repairs WHERE id = ?", [repairId]);
    if (repairRows.length === 0) {
      return res.status(404).json({ message: "Réparation introuvable." });
    }

    // Mise à jour de la réparation
    await db.query(
      `UPDATE Repairs SET repair_date = ?, description = ?, mileage = ?, cost = ?
       WHERE id = ?`,
      [repair_date, description, mileage, cost, repairId]
    );

    res.json({ message: "Réparation mise à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la réparation :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Fonction pour supprimer une réparation
exports.deleteRepair = async (req, res) => {
  const { repairId } = req.params;

  try {
    // Vérifier si la réparation existe
    const [repairRows] = await db.query("SELECT * FROM Repairs WHERE id = ?", [repairId]);
    if (repairRows.length === 0) {
      return res.status(404).json({ message: "Réparation introuvable." });
    }

    // Suppression de la réparation
    await db.query("DELETE FROM Repairs WHERE id = ?", [repairId]);
    res.json({ message: "Réparation supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de la réparation :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
