const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
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
