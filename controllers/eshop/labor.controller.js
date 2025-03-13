const Labor_eshop = require("../../models/eshop/labor.model")

const addLabor = async(req,res)=>{
    try {
        const {type,price} = req.body
        if(!type || !price) throw new Error("Both field are required!")
        const isExist = await Labor_eshop.findOne({type,price})
        if(isExist) throw new Error("Already Exist!")
        await Labor_eshop({type,price}).save()
        res.status(200).json({message:"Labor Type Added Successfully!"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const getLabors = async(req,res)=>{
    try {
        const data = await Labor_eshop.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateLabor = async(req,res)=>{
    try {
        const id = req.params?.id;
        if(!id) throw new Error("Id not found!")
        const {type,price} = req.body
        if(!type || !price) throw new Error("Both field are required!")
        await Labor_eshop.findByIdAndUpdate(id,{type,price})
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const deleteLabor = async(req,res)=>{
    try {
        const id = req.params?.id;
        if(!id) throw new Error("Id not found!")
        await Labor_eshop.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
module.exports = {addLabor,getLabors,updateLabor,deleteLabor}