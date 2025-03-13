const Collection_khw = require("../../models/khwaahish/collection.model")
const Product_khw = require("../../models/khwaahish/product.model")
const { deleteFileFromS3 } = require("../../services/S3_Services")


const addCollection = async(req,res)=>{
    const image = req?.imageUrl
    const nav_image = req?.navImageUrl
    try {
        const {name,tagline,description,showInNav,showInCollection,hasHomePage,pathOfHomePage} = req.body
        if(!name) throw new Error("Enter Collection Name")
        const isExist = await Collection_khw.findOne({name:name})
        if(isExist) throw new Error("Collection Already Exist!")
        const newCollection = new Collection_khw({name,tagline,description,image,nav_image,showInNav,showInCollection,hasHomePage,pathOfHomePage}) 
        await newCollection.save()
        res.status(200).json({message:"Added successfully"})
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        if(nav_image?.key){
            deleteFileFromS3(nav_image.key)
        }
        res.status(400).json({error:error.message})
    }
}

const getAllCollections = async(req,res)=>{
    try {
        const data = await Collection_khw.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getCollectionByName = async(req,res)=>{
    try {
        const name = req?.params?.name 
        const data = await Collection_khw.findOne({name:{ $regex: new RegExp(`^${name}$`, "i") }})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const updateCollection = async(req,res)=>{
    const image = req?.imageUrl
    const nav_image = req?.navImageUrl
    try {
        const _id = req.params?.id;
        const {name,tagline,description,showInNav,showInCollection,hasHomePage,pathOfHomePage} = req.body 
        if(!name) throw new Error("Enter Collection Name")
        const data = await Collection_khw.findById(_id)
        if(!data) throw new Error("Collection not exist")
        if(image?.key){
            data?.image?.key && deleteFileFromS3(data?.image?.key)
            data.image = image
        }
        if(nav_image?.key){
            data?.nav_image?.key && deleteFileFromS3(data?.nav_image?.key)
            data.nav_image = nav_image
        }
        data.name = name
        data.tagline = tagline
        data.description = description
        data.showInNav = showInNav
        data.showInCollection = showInCollection
        data.hasHomePage = hasHomePage
        data.pathOfHomePage = pathOfHomePage
        await data.save()
        res.status(200).json({message:"Updated Successfully"})
    } catch (error) {
        if(image?.key){
            deleteFileFromS3(image.key)
        }
        if(nav_image?.key){
            deleteFileFromS3(nav_image.key)
        }
        res.status(400).json({error:error.message})
    }
}

const deleteCollection = async(req,res)=>{
    try {
        const _id = req.params?.id;
        const data = await Collection_khw.findById(_id)
        if(!data) throw new Error("Collection not found!")
        if(data?.image && data?.image?.key){
            deleteFileFromS3(data.image?.key)
        }
        if(data?.nav_image && data?.nav_image?.key){
            deleteFileFromS3(data.nav_image?.key)
        }
        await Collection_khw.findByIdAndDelete(_id)
        res.status(200).json({message:"Deleted Successfully"})
        await Product_khw.deleteMany({collection:_id})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports = {addCollection,getAllCollections,getCollectionByName,updateCollection,deleteCollection}