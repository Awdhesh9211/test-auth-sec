const Category_eshop = require("../../models/eshop/category.model");
const Products_eshop = require("../../models/eshop/product.model");
const Style_eshop = require("../../models/eshop/style.model");
const { deleteFileFromS3 } = require("../../services/S3_Services");

const addStyle = async (req, res) => {
  const image = req?.imageUrl
  try {
    const { name, categoryId } = req.body;

    // Validate required fields
    if(!name) throw new Error("Enter Style Name")
    if(!categoryId) throw new Error("Select Category")

    // Create new Category
    const newStyle = new Style_eshop({ name,image });
    await newStyle.save();

    await Category_eshop.findByIdAndUpdate(categoryId, {
      $push: { styles: newStyle._id },
    });

    res.status(200).json({ message: "Style Added Successfully" });
  } catch (error) {
    if(image?.key){
      deleteFileFromS3(image.key)
    }
    res.status(400).json({ error: error.message });
  }
};

const getAllStyles = async (req, res) => {
  try {
    const data = await Style_eshop.find({})
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStyle = async(req,res)=>{
  const image = req?.imageUrl
  try {
    const id = req.params?.id;
    const { name, categoryId } = req.body;
    if(!name) throw new Error("Enter Style Name")
    if(!categoryId) throw new Error("Select Category")
    const style = await Style_eshop.findById(id)
    if(!style) throw new Error("Style not exist!")

    await Category_eshop.updateMany(
      { styles: style._id },
      { $pull: { styles: style._id } }
    )
    if(image?.key){
      console.log("runn1111")
      style?.image?.key && deleteFileFromS3(style.image.key)
      console.log("runn2222")
      style.image = image
    }
    style.name = name 
    await style.save()
    await Category_eshop.findByIdAndUpdate(categoryId, {
      $push: { styles: style._id },
    });
    res.status(200).json({message:"Update Successfully"})
  } catch (error) {
    if(image?.key){
      deleteFileFromS3(image.key)
    }
    res.status(400).json({ error: error.message });
  }
}

const deleteStyle = async(req,res)=>{
  try {
    const id = req.params?.id;
    if(!id) throw new Error("Style id not found!")
    const style = await Style_eshop.findById(id)
    if(!style) throw new Error("Style not exist!")
    if(style?.image?.key){
      deleteFileFromS3(style.image.key)
    }
    await Style_eshop.deleteOne({_id:style._id})
    await Category_eshop.updateMany(
      { styles: style._id },
      { $pull: { styles: style._id } }
    )
    await Products_eshop.deleteMany({style:id})
    res.status(200).json({message:"Deleted Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addStyle,getAllStyles,updateStyle,deleteStyle };
