const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    type: {
      type: String,
      required: [true, "Please provide a channel type"],
      unique: true,
    },
    description: {
      type: String,
    },
    unit: {
      type: String,
      required: [true, "Please provide a channel unit"],
    },
    factor: {
      type: Number,
      required: [true, "Please provide a factor value"],
    }
  });
  
const Channel = mongoose.model('Channel', ChannelSchema);

const DeviceSchema = new mongoose.Schema({
    MAC: {
      type: String,
      required: [true, "Please provide a MAC address"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a device name"],
    },
    description: {
      type: String,
    },
  });
  
const Device = mongoose.model('Device', DeviceSchema);

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

module.exports =  {Device, Channel, Measurement}
