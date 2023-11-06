const Measurement = require("../models/Measurement");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Pobieranie wszystkich pomiarów
// @route   GET /api/measurements
// @access  Public
exports.getMeasurements = async (req, res, next) => {
  try {
    const measurements = await Measurement.find();
    res.status(200).json({
      success: true,
      data: measurements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie pojedynczego pomiaru na podstawie ID
// @route   GET /api/measurements/:id
// @access  Public
exports.getMeasurementById = async (req, res, next) => {
  try {
    const measurement = await Measurement.findOne({ ID_measurement: req.params.id });
    if (!measurement) {
      return next(new ErrorResponse(`Measurement not found with ID ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dodawanie nowego pomiaru
// @route   POST /api/measurements
// @access  Private
exports.addMeasurement = async (req, res, next) => {
    try {
      const measurement = await Measurement.create(req.body);
      res.status(201).json({
        success: true,
        data: measurement,
      });
    } catch (error) {
      next(error);
    }
  };
