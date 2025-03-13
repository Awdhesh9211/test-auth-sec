const Gold_eshop = require("../../models/eshop/gold.model")
const addGold = async(req,res)=>{
    try {
        const {carat,pricePerGram,making_charge,wastage_charge} = req.body 
        if(!carat || !pricePerGram) throw new Error("Both field are required!")
        const isExit = await Gold_eshop.findOne({carat,pricePerGram})
        if(isExit) throw new Error("Already Exist!")
        const makingCharge = making_charge ? making_charge:null
        const wastageCharge = wastage_charge ? wastage_charge:null
        await Gold_eshop({carat,pricePerGram,making_charge:makingCharge,wastage_charge:wastageCharge}).save()
        res.status(200).json({message:"Gold Added Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getGolds = async(req,res)=>{
    try {
        const data = await Gold_eshop.find().populate(["wastage_charge","making_charge"])
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateGold = async(req,res)=>{
    try {
        const id = req.params?.id;
        const {carat,pricePerGram,making_charge,wastage_charge} = req.body 
        if(!carat || !pricePerGram) throw new Error("Both field are required!")
        const makingCharge = making_charge ? making_charge:null
        const wastageCharge = wastage_charge ? wastage_charge:null
        await Gold_eshop.findByIdAndUpdate(id,{carat,pricePerGram,making_charge:makingCharge,wastage_charge:wastageCharge})
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const deleteGold = async(req,res)=>{
    try {
        const id = req.params?.id;
        if(!id) throw new Error("Id not found!")
        await Gold_eshop.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addGold,getGolds,updateGold,deleteGold}