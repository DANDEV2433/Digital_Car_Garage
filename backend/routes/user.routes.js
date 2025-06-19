const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const db = require("../models/db");
const bcrypt = require("bcrypt");

// Récupérer les infos du user connecté
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM User WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour les infos du user connecté
router.put("/me", authenticateUser, async (req, res) => {
  const { nom, prenom, email, raisonSociale, currentPassword, newPassword } = req.body;

  try {
    // Récupère l'utilisateur actuel
    const [rows] = await db.query("SELECT * FROM User WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur introuvable" });

    const user = rows[0];

    // Prépare les nouvelles valeurs, garde les anciennes si non fournies
    const updatedNom = nom || user.last_name;
    const updatedPrenom = prenom || user.first_name;
    const updatedEmail = email || user.email;
    const updatedRaison = raisonSociale || user.raison_sociale;

    // Vérifie si on souhaite changer le mot de passe
    if (currentPassword && newPassword) {
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Ancien mot de passe incorrect" });
      }

      const hashedNew = await bcrypt.hash(newPassword, 10);
      await db.query(
        `UPDATE User SET password = ? WHERE id = ?`,
        [hashedNew, req.user.id]
      );
    }

    // Met à jour les autres infos
    await db.query(
      `UPDATE User SET last_name = ?, first_name = ?, email = ?, raison_sociale = ?
       WHERE id = ?`,
      [updatedNom, updatedPrenom, updatedEmail, updatedRaison, req.user.id]
    );

    res.json({ message: "Compte mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

module.exports = router;