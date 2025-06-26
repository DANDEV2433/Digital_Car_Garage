const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repair.controller");
const verifyToken = require("../middleware/verifyToken.middleware");

// Toutes les routes sont protégées par le token
router.use(verifyToken);

// Créer une réparation pour un véhicule
// POST /api/v1/vehicles/:vehicleId/repairs
router.post("/:vehicleId", repairController.createRepair);

// Modifier une réparation existante
// PUT /api/v1/repairs/:repairId
router.put("/update/:repairId", repairController.updateRepair);

// Supprimer une réparation
// DELETE /api/v1/repairs/:repairId
router.delete("/delete/:repairId", repairController.deleteRepair);

// Récupérer toutes les réparations d’un véhicule
// GET /api/v1/vehicles/:vehicleId/repairs
router.get("/:vehicleId", repairController.getRepairsByVehicle);

module.exports = router;
