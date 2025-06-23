const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repair.controller");
const verifyToken = require("../middleware/verifyToken.middleware");

// Toutes les routes sont protégées par le token
router.use(verifyToken);

// Créer une réparation pour un véhicule
// POST /api/v1/vehicles/:vehicleId/repairs
router.post("/vehicles/:vehicleId/repairs", repairController.createRepair);

// Modifier une réparation existante
// PUT /api/v1/repairs/:repairId
router.put("/repairs/:repairId", repairController.updateRepair);

// Supprimer une réparation
// DELETE /api/v1/repairs/:repairId
router.delete("/repairs/:repairId", repairController.deleteRepair);

// Récupérer toutes les réparations d’un véhicule
// GET /api/v1/vehicles/:vehicleId/repairs
router.get("/vehicles/:vehicleId/repairs", repairController.getRepairsByVehicle);

module.exports = router;
