const mongoose = require("mongoose");

const eshopBenefitSchema_eshop = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { key: String, url: String }, // S3 image file info
});

module.exports = mongoose.model("EshopBenefit", eshopBenefitSchema_eshop);
