const mongoose = require("mongoose");

const CategorySchema_khw = new mongoose.Schema({
  name: { type: String,unique:true, required: true},
  description:{type:String},
  image:{key:String,url:String},
  nav_image:{key:String,url:String},
  showInNav:{type:Boolean,default:false},
});

const Category_khw = mongoose.model("Category_khw", CategorySchema_khw);

module.exports = Category_khw;
