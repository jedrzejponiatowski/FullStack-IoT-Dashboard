const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, "Please provide the value"],
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: [true, "Please provide a device ID"],
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, "Please provide a channel ID"],
  },
  timestamp: {
    type: Number,
    required: [true, "Please provide a timestamp"],
  },
  status: {
    type: String,
    required: [true, "Please provide a measurement status"],
  }
});

const Measurement = mongoose.model('Measurement', MeasurementSchema);

module.exports = Measurement;
