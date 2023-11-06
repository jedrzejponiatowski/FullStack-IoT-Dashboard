const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  ID_channel: {
    type: Number,
    required: [true, "Please provide an ID for the channel"],
    key: true,
  },
  type: {
    type: String,
    required: [true, "Please provide a channel type"],
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
