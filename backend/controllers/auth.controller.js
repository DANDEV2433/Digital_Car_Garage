const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("../models/db");

exports.register = async (req, res) => {
  const role = req.body.role; // 'client' ou 'garage'

  const last_name = req.body.nom || req.body.last_name || req.body.lastName;
  const first_name = req.body.prenom || req.body.first_name || req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const raison_sociale = req.body.raisonSociale || null;

  console.log("Données reçues dans register :", req.body);

  try {
    // Récupérer l'UUID du rôle dans la table Role
    const [roleRows] = await db.query("SELECT id FROM Role WHERE name = ?", [role]);
    if (roleRows.length === 0) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
    const role_id = roleRows[0].id;

    // Vérifier si email existe déjà
    const [existing] = await db.query("SELECT * FROM User WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    if (raison_sociale) {
      await db.query(
        `INSERT INTO User (id, role_id, last_name, first_name, email, password, raison_sociale)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, role_id, last_name, first_name, email, hashedPassword, raison_sociale]
      );
    } else {
      await db.query(
        `INSERT INTO User (id, role_id, last_name, first_name, email, password)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, role_id, last_name, first_name, email, hashedPassword]
      );
    }

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur dans register:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
