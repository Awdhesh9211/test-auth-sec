const mongoose = require("mongoose");

const StyleSchema_khw = new mongoose.Schema({
  name: { type: String, required: true},
});

const Style_khw = mongoose.model("Style_khw", StyleSchema_khw);

module.exports = Style_khw