const mongoose = require("mongoose")

const collectionSchema_eshop = new mongoose.Schema({
    name:{type:String,required:true},
    tagline:{type:String},
    description:{type:String},
    image:{key:String,url:String},
})

const Collection_eshop = mongoose.model("Collection_eshop",collectionSchema_eshop)
module.exports = Collection_eshop;