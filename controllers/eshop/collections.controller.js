const Collection_eshop = require("../../models/eshop/collection.model")
const Products_eshop = require("../../models/eshop/product.model")
const { deleteFileFromS3 } = require("../../services/S3_Services")


const addCollection = async(req,res)=>{
    const image = req?.imageUrl
    try {
        const {name,tagline,description} = req.body
        if(!name) throw new Error("Enter Collection Name")
        const isExist = await Collection_eshop.findOne({name:name})
        if(isExist) throw new Error("Collection Already Exist!")
        const newCollection = new Collection_eshop({name,tagline,description,image}) 
        await newCollection.save()
        res.status(200).json({message:"Added successfully"})
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        res.status(400).json({error:error.message})
    }
}

const getAllCollections = async(req,res)=>{
    try {
        const data = await Collection_eshop.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateCollection = async(req,res)=>{
    const image = req?.imageUrl
    try {
        const _id = req.params?.id;
        const {name,tagline,description} = req.body 
        if(!name) throw new Error("Enter Collection Name")
        const data = await Collection_eshop.findById(_id)
        if(!data) throw new Error("Collection not exist")
        if(image?.key){
            data?.image?.key && deleteFileFromS3(data?.image?.key)
            data.image = image
        }
        data.name = name
        data.tagline = tagline
        data.description = description
        await data.save()
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        res.status(400).json({error:error.message})
    }
}

const deleteCollection = async(req,res)=>{
    try {
        const _id = req.params?.id;
        const data = await Collection_eshop.findById(_id)
        console.log(data,_id)
        if(!data) throw new Error("Collection not found!")
        if(data?.image && data?.image?.key){
            deleteFileFromS3(data.image.key)
        }
        await Collection_eshop.findByIdAndDelete(_id)
        await Products_eshop.deleteMany({collection:_id})
        res.status(200).json({message:"Deleted Successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addCollection,getAllCollections,updateCollection,deleteCollection}