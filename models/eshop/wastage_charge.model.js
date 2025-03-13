const mongoose = require("mongoose")
const wastageSchema = new mongoose.Schema({
    name:{type:String,required:true},
    percent:{type:Number,required:true},
})

const WastageCharge = mongoose.model("wastage_charge_eshop",wastageSchema)
module.exports = WastageCharge;