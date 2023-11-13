const { Channel } = require("../models/Measurement");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Dodawanie nowego kanału
// @route   POST /api/channels
// @access  Private
exports.addChannel = async (req, res, next) => {
  try {
    const channel = await Channel.create(req.body);
    res.status(201).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie wszystkich kanałów
// @route   GET /api/channels
// @access  Private
exports.getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find();
    res.status(200).json({
      success: true,
      data: channels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pobieranie pojedynczego kanału
// @route   GET /api/channels/:id
// @access  Private
exports.getChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return next(new ErrorResponse(`Channel not found with ID ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aktualizacja kanału
// @route   PUT /api/channels/:id
// @access  Private
exports.updateChannel = async (req, res, next) => {
    try {
      const channel = await Channel.findByIdAndUpdate(
        req.params.id, // Zmieniłem na req.params.id
        req.body, // Przekazuje dane z żądania do aktualizacji
        {
          new: true, // Zwraca zaktualizowany kanał
          runValidators: true, // Uruchamia walidatory schematu
        }
      );
      if (!channel) {
        return next(new ErrorResponse(`Channel not found with ID ${req.params.id}`, 404));
      }
      res.status(200).json({
        success: true,
        data: channel,
      });
    } catch (error) {
      next(error);
    }
  };

// @desc    Usuwanie kanału
// @route   DELETE /api/channels/:id
// @access  Private
exports.deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findByIdAndDeletedAndDelete(req.params.id);
    if (!channel) {
      return next(new ErrorResponse(`Channel not found with ID ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
