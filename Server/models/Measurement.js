const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  ID_measurement: {
    type: Number,
    required: [true, "Please provide an ID for the measurement"],
  },
  measurement: {
    type: Number,
    required: [true, "Please provide the measurement value"],
  },
  ID_Device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: [true, "Please provide a device ID"],
  },
  ID_Channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: [true, "Please provide a channel ID"],
  },
  Timestamp: {
    type: Number,
    required: [true, "Please provide a timestamp"],
  },
  Status: {
    type: String,
    required: [true, "Please provide a measurement status"],
  },
});

const Measurement = mongoose.model("Measurement", MeasurementSchema);

module.exports = Measurement;
