const express = require("express");
const router = express.Router();
const {
  addDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/DeviceController");

// Wszystkie urządzenia
router.route("/").get(getDevices);

// Dodawanie nowego urządzenia
router.route("/").post(addDevice);

// Pobieranie pojedynczego urządzenia
router.route("/:id").get(getDevice);

// Aktualizacja urządzenia
router.route("/:id").put(updateDevice);

// Usuwanie urządzenia
router.route("/:id").delete(deleteDevice);


module.exports = router;
