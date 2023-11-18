const express = require("express");
const router = express.Router();
const {
    getMeasurements,
    getMeasurementById,
    addMeasurement,
    deleteMeasurements,
    getMeasurementsByChannel // Dodaj tę funkcję do routera
} = require("../controllers/MeasurementController");

// Pobieranie wszystkich pomiarów
router.route('/').get(getMeasurements).post(addMeasurement).delete(deleteMeasurements); 

// Pobieranie pojedynczego pomiaru na podstawie ID
router.route("/:id").get(getMeasurementById);

// Dodawanie nowego pomiaru
router.route("/").post(addMeasurement);

// Nowa ścieżka do pobierania pomiarów z określonego kanału
router.route("/channel/:channel").get(getMeasurementsByChannel);

module.exports = router;