const mongoose = require("mongoose")
const makingSchema = new mongoose.Schema({
    name:{type:String,required:true},
    percent:{type:Number,required:true},
})

const MakingCharge = mongoose.model("making_charge_eshop",makingSchema)
module.exports = MakingCharge;