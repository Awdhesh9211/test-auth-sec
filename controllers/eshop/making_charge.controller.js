const MakingCharge = require("../../models/eshop/making_charge.model")
const addMakingCharge = async(req,res)=>{
    try {
        const {name,percent} = req.body 
        if(!name) throw new Error("Enter Name")
        if(!percent) throw new Error("Enter Percent")
        await MakingCharge({name,percent}).save()
        res.status(200).json({message:"Making Charge Added"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getMakingCharges = async(req,res)=>{
    try {
        const data = await MakingCharge.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateMakingCharge = async(req,res)=>{
    try {
        const id = req.params?.id;
        const {name,percent} = req.body 
        if(!name) throw new Error("Enter Name")
        if(!percent) throw new Error("Enter Percent")
        await MakingCharge.findByIdAndUpdate(id,{name,percent})
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const deleteMakingCharge = async(req,res)=>{
    try {
        const id = req.params?.id;
        await MakingCharge.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addMakingCharge,getMakingCharges,updateMakingCharge,deleteMakingCharge}