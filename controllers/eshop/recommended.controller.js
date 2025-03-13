const Recommended_eshop = require("../../models/eshop/recommended.model")
const { deleteFileFromS3 } = require("../../services/S3_Services");


const addRecommended = async(req,res)=>{
    const image = req?.imageUrl
    try {
        const {name} = req.body 
        if(!name) throw new Error("Enter name!")
        await Recommended_eshop({name,image}).save()
        res.status(200).json({ message: "Added Successfully" });
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        res.status(400).json({ error: error.message });
    }
}

const getRecommended = async(req,res)=>{
    try {
        const data = await Recommended_eshop.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateRecommended = async(req,res)=>{
    const image = req?.imageUrl
    try {
        const id = req.params?.id;
        const {name} = req.body 
        if(!name) throw new Error("Enter name!")
        const data = await Recommended_eshop.findById(id)
        if(!data) throw new Error("Data not found!")
        if(image?.key){
            data?.image?.key && deleteFileFromS3(data.image.key)
            data.image = image
        }
        data.name = name
        await data.save()
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        res.status(400).json({ error: error.message });
    }
}

const deleteRecommended = async(req,res)=>{
    try {
        const id = req.params?.id;
        const data = await Recommended_eshop.findById(id)
        if(!data) throw new Error("Data not found!")
        if(data?.image?.key){
            deleteFileFromS3(data.image.key)
        }
        await Recommended_eshop.findByIdAndDelete(id)
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {addRecommended,getRecommended,updateRecommended,deleteRecommended}