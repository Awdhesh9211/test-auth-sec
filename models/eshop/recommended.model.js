const mongoose = require("mongoose")

const recommendedSchema_eshop = new mongoose.Schema({
    name:{type:String,required:true},
    image:{key:String,url:String},
})

const Recommended_eshop = mongoose.model("recommeded_eshop",recommendedSchema_eshop)
module.exports = Recommended_eshop