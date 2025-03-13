const mongoose = require("mongoose")

const collectionSchema_khw = new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    tagline:{type:String},
    description:{type:String},
    image:{key:String,url:String},
    nav_image:{key:String,url:String},
    showInNav:{type:Boolean,default:false},
    showInCollection:{type:Boolean,default:false},
    hasHomePage:{type:Boolean,default:false},
    pathOfHomePage:{type:String}
})

const Collection_khw = mongoose.model("Collection_khw",collectionSchema_khw)
module.exports = Collection_khw;