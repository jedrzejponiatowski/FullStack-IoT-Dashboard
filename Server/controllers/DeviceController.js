const { Device } = require("../models/Measurement");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Dodawanie nowego urządzenia
// @route   POST /api/devices
// @access  Private
exports.addDevice = async (req, res, next) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie wszystkich urządzeń
// @route   GET /api/devices
// @access  Private
exports.getDevices = async (req, res, next) => {
  try {
    const devices = await Device.find();
    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie pojedynczego urządzenia
// @route   GET /api/devices/:id
// @access  Private
exports.getDevice = async (req, res, next) => {
    try {
      const device = await Device.findById(req.params.id);
      if (!device) {
        return next(new ErrorResponse(`Device not found with ID ${req.params.id}`, 404));
      }
      res.status(200).json({
        success: true,
        data: device,
      });
    } catch (error) {
      next(error);
    }
  };

// @desc    Aktualizacja urządzenia
// @route   PUT /api/devices/:id
// @access  Private
exports.updateDevice = async (req, res, next) => {
    try {
      const device = await Device.findByIdAndUpdate(
        req.params.id, // Zmieniłem na req.params.id
        req.body, // Przekazuje dane z żądania do aktualizacji
        {
          new: true, // Zwraca zaktualizowane urządzenie
          runValidators: true, // Uruchamia walidatory schematu
        }
      );
      if (!device) {
        return next(new ErrorResponse(`Device not found with ID ${req.params.id}`, 404));
      }
      res.status(200).json({
        success: true,
        data: device,
      });
    } catch (error) {
      next(error);
    }
  };
  

// @desc    Usuwanie urządzenia
// @route   DELETE /api/devices/:id
// @access  Private
exports.deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return next(new ErrorResponse(`Device not found with ID ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
