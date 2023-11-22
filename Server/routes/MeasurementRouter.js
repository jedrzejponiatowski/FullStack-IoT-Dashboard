const express = require("express");
const router = express.Router();
const {
    getMeasurements,
    getMeasurementById,
    addMeasurement,
    deleteMeasurements,
    getMeasurementsByChannel,
    getMeasurementsByChannelAndTimeRange
} = require("../controllers/MeasurementController");


router.route("/filtered").get(getMeasurementsByChannelAndTimeRange);

/*
router.route("/filtered").get((req, res) => {
    const { channel, startTime, endTime } = req.query;

    // Tutaj możesz obsłużyć zapytanie zgodnie z potrzebami, na przykład używając funkcji z MeasurementController
    // Przykładowa implementacja (załóżmy, że masz funkcję getMeasurementsByChannelAndTimeRange w kontrolerze):
    const filteredMeasurements = getMeasurementsByChannelAndTimeRange(channel, startTime, endTime);

    // Poniżej zakładam, że filteredMeasurements to wynik zapytania z kontrolera
    res.json({ success: true, data: filteredMeasurements });
});
*/
// Pobieranie wszystkich pomiarów
router.route('/').get(getMeasurements).post(addMeasurement).delete(deleteMeasurements); 

// Pobieranie pojedynczego pomiaru na podstawie ID
router.route("/:id").get(getMeasurementById);

// Dodawanie nowego pomiaru
router.route("/").post(addMeasurement);

// Nowa ścieżka do pobierania pomiarów z określonego kanału
router.route("/channel/:channel").get(getMeasurementsByChannel);



module.exports = router;