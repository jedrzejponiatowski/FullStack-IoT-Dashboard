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

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
