const mongoose = require("mongoose");

const goldSchema_eshop = new mongoose.Schema({
  carat: { type: String, required: true, unique: true }, 
  pricePerGram: { type: Number, required: true }, 
  making_charge: { type: mongoose.Schema.Types.ObjectId, ref: "making_charge_eshop" },
  wastage_charge: { type: mongoose.Schema.Types.ObjectId, ref: "wastage_charge_eshop" },
});

const Gold_eshop = mongoose.model("Gold_eshop", goldSchema_eshop);
module.exports = Gold_eshop;
