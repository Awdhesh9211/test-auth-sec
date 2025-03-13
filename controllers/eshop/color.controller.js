const Color_eshop = require("../../models/eshop/color.model")

const addColor = async(req,res)=>{
    try {
        const {name,color_code} = req.body
        if(!name || !color_code) throw new Error("All filed are required!")
        const isExist = await Color_eshop.findOne({name:name})
        if(isExist) throw new Error("Color Already Exist!")
        const color = new Color_eshop({name,color_code})
        await color.save()
        res.status(200).json({message:"Color added successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const getColors = async(req,res)=>{
    try {
        const colors = await Color_eshop.find({})
        res.status(200).json(colors)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateColor = async(req,res)=>{
    try {
        const _id = req.params?.id;
        const {name,color_code} = req.body
        if(!name || !color_code) throw new Error("All filed are required!")
        await Color_eshop.findByIdAndUpdate(_id,{name,color_code})
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const deleteColor = async(req,res)=>{
    try {
        const _id = req.params?.id;
        await Color_eshop.findByIdAndDelete(_id)
        res.status(200).json({message:"Deleted successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
module.exports = {addColor,getColors,updateColor,deleteColor}