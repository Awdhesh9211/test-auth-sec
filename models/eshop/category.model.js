const mongoose = require("mongoose");

const CategorySchema_eshop = new mongoose.Schema({
  name: { type: String, required: true},
  image:{key:String,url:String},
  description:{type:String},
  styles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Style_eshop" }],
});

const Category_eshop = mongoose.model("Category_eshop", CategorySchema_eshop);

module.exports = Category_eshop;
