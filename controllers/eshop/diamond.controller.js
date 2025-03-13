const Diamond_eshop = require("../../models/eshop/diamond.model")

const addDiamond = async(req,res)=>{
    try {
        const {grade,variant,priceRanges} = req.body 
        if(!grade) throw new Error("Grade are required!")
        if(!variant) throw new Error("Variant are required!")
        const isExist = await Diamond_eshop.findOne({grade,variant})
        if(isExist) throw new Error("Already exist this grade with this variant!")
        await Diamond_eshop({grade,variant,priceRanges}).save()
        res.status(200).json({message:"Diamond Added Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getDiamonds = async(req,res)=>{
    try {
        const data = await Diamond_eshop.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateDiamond = async(req,res)=>{
    try {
        const id = req.params?.id;
        if(!id) throw new Error("Id not found!")
        const {grade,variant,priceRanges} = req.body 
        if(!grade) throw new Error("Grade are required!")
        if(!variant) throw new Error("Variant are required!")
        await Diamond_eshop.findByIdAndUpdate(id,{grade,variant,priceRanges})
        res.status(200).json({message:"Updated successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const deleteDiamond = async(req,res)=>{
    try {
        const id = req.params?.id;
        if(!id) throw new Error("Id not found!")
        await Diamond_eshop.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addDiamond,getDiamonds,updateDiamond,deleteDiamond}