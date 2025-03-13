const mongoose = require("mongoose");

const colorSchema_eshop = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  color_code: { type: String, required: true },
});

const Color_eshop = mongoose.model("Color_eshop", colorSchema_eshop);

module.exports = Color_eshop