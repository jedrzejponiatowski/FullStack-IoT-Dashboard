const express = require("express");
const router = express.Router();
const {
  addChannel,
  getChannels,
  getChannel,
  updateChannel,
  deleteChannel,
} = require("../controllers/ChannelController");

// Dodawanie nowego kanału
router.route("/").post(addChannel);

// Pobieranie wszystkich kanałów
router.route("/").get(getChannels);

// Pobieranie pojedynczego kanału
router.route("/:id").get(getChannel);

// Aktualizacja kanału
router.route("/:id").put(updateChannel);

// Usuwanie kanału
router.route("/:id").delete(deleteChannel);

module.exports = router;
