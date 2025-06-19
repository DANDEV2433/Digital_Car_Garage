// backend/middleware/authenticateUser.js
const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient : id, email, role
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = authenticateUser;
