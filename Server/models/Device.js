const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  ID_device: {
    type: Number,
    required: [true, "Please provide an ID for the device"],
    key: true,
  },
  MAC: {
    type: String,
    required: [true, "Please provide a MAC address"],
  },
  name: {
    type: String,
    required: [true, "Please provide a device name"],
  },
  description: {
    type: String,
  },
});

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
