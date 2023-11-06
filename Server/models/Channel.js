const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  ID_channel: {
    type: Number,
    required: [true, "Please provide an ID for the channel"],
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
  },
  // Dodaj inne pola, które chcesz przechowywać w modelu kanału
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
