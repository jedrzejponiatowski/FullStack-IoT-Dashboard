const express = require("express");
const router = express.Router();
const {
  addActiveMeasurement,
  getActiveMeasurements,
  getActiveMeasurement,
  updateActiveMeasurement,
  deleteActiveMeasurement,
} = require("../controllers/ActiveMeasurementController");

// Wszystkie aktywne pomiary
router.route("/").get(getActiveMeasurements);

// Dodawanie nowego aktywnego pomiaru
router.route("/").post(addActiveMeasurement);

// Pobieranie pojedynczego aktywnego pomiaru
router.route("/:id").get(getActiveMeasurement);

// Aktualizacja aktywnego pomiaru
router.route("/:id").put(updateActiveMeasurement);

// Usuwanie aktywnego pomiaru
router.route("/:id").delete(deleteActiveMeasurement);

module.exports = router;
