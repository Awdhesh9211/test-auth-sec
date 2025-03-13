const mongoose = require("mongoose")

const laborSchema_eshop = new mongoose.Schema({
    type:{type:String,required:true},
    price:{type:Number,required:true}
})

const Labor_eshop = mongoose.model("Labor_eshop",laborSchema_eshop)

module.exports = Labor_eshop