const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

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
    const [roleRows] = await db.query("SELECT id, name FROM Role WHERE name = ?", [role]);
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
    const userId = uuidv4();

    // Insertion dans User
    if (raison_sociale) {
      await db.query(
        `INSERT INTO User (id, role_id, last_name, first_name, email, password, raison_sociale)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, role_id, last_name, first_name, email, hashedPassword, raison_sociale]
      );
    } else {
      await db.query(
        `INSERT INTO User (id, role_id, last_name, first_name, email, password)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, role_id, last_name, first_name, email, hashedPassword]
      );
    }

    // 🔧 Ajout dans la table Garage si le rôle est garage
    console.log("Nom du rôle reçu :", roleRows[0].name);
    if (roleRows[0].name === "garage" && raison_sociale) {
      console.log("Insertion dans la table Garage...");
      const garageId = uuidv4();
      await db.query(
        `INSERT INTO Garage (id, company_name, user_id)
         VALUES (?, ?, ?)`,
        [garageId, raison_sociale, userId]
      );
    }

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur dans register:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Vérifier si l'utilisateur existe
    const [rows] = await db.query("SELECT * FROM User WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "20m"
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d"
    });

    res
  .cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  })
  .cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  })
  .status(200)
  .json({
    role_id: user.role_id,
    user_id: user.id,
    message: "Connexion réussie"
  });
  }
  catch (err) {
    console.error("Erreur dans login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
exports.logout = (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json({ message: "Déconnexion réussie" });
};
