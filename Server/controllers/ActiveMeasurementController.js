const { ActiveMeasurements } = require("../models/Measurement");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Dodawanie nowego aktywnego pomiaru
// @route   POST /api/active-measurements
// @access  Private
exports.addActiveMeasurement = async (req, res, next) => {
  try {
    const activeMeasurement = await ActiveMeasurements.create(req.body);
    res.status(201).json({
      success: true,
      data: activeMeasurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie wszystkich aktywnych pomiarów
// @route   GET /api/active-measurements
// @access  Private
exports.getActiveMeasurements = async (req, res, next) => {
  try {
    const activeMeasurements = await ActiveMeasurements.find()
      .populate('device') // Dodaj populate dla urządzenia
      .populate('channel') // Dodaj populate dla kanału
      .exec();

    res.status(200).json({
      success: true,
      data: activeMeasurements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie pojedynczego aktywnego pomiaru
// @route   GET /api/active-measurements/:id
// @access  Private
exports.getActiveMeasurement = async (req, res, next) => {
  try {
    const activeMeasurement = await ActiveMeasurements.findById(req.params.id)
      .populate('device') // Dodaj populate dla urządzenia
      .populate('channel') // Dodaj populate dla kanału
      .exec();

    if (!activeMeasurement) {
      return next(new ErrorResponse(`Active measurement not found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: activeMeasurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aktualizacja aktywnego pomiaru
// @route   PUT /api/active-measurements/:id
// @access  Private
exports.updateActiveMeasurement = async (req, res, next) => {
  try {
    const activeMeasurement = await ActiveMeasurements.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('device') // Dodaj populate dla urządzenia
      .populate('channel') // Dodaj populate dla kanału
      .exec();

    if (!activeMeasurement) {
      return next(new ErrorResponse(`Active measurement not found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: activeMeasurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Usuwanie aktywnego pomiaru
// @route   DELETE /api/active-measurements/:id
// @access  Private
exports.deleteActiveMeasurement = async (req, res, next) => {
  try {
    const activeMeasurement = await ActiveMeasurements.findByIdAndDelete(req.params.id)
      .populate('device') // Dodaj populate dla urządzenia
      .populate('channel') // Dodaj populate dla kanału
      .exec();

    if (!activeMeasurement) {
      return next(new ErrorResponse(`Active measurement not found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
