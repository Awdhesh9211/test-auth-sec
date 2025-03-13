const WastageCharge = require("../../models/eshop/wastage_charge.model")
const addWastageCharge = async(req,res)=>{
    try {
        const {name,percent} = req.body 
        if(!name) throw new Error("Enter Name")
        if(!percent) throw new Error("Enter Percent")
        await WastageCharge({name,percent}).save()
        res.status(200).json({message:"Wastage Charge Added"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getWastageCharge = async(req,res)=>{
    try {
        const data = await WastageCharge.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateWastageCharge = async(req,res)=>{
    try {
        const id = req.params?.id;
        const {name,percent} = req.body 
        if(!name) throw new Error("Enter Name")
        if(!percent) throw new Error("Enter Percent")
        await WastageCharge.findByIdAndUpdate(id,{name,percent})
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const deleteWastageCharge = async(req,res)=>{
    try {
        const id = req.params?.id;
        await WastageCharge.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addWastageCharge,getWastageCharge,updateWastageCharge,deleteWastageCharge}