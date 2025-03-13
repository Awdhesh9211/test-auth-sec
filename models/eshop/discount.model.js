const mongoose = require("mongoose");

const discountSchema_eshop = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category_eshop", select: false },
  style: { type: mongoose.Schema.Types.ObjectId, ref: "Style_eshop", select: false },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection_eshop", select: false },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product_eshop", select: false },
  discount_on: { type: String },
  percent: { type: Number, required: true },
  message: { type: String },
});

const Discount_eshop = mongoose.model("Discount_eshop", discountSchema_eshop );
module.exports = Discount_eshop