const Category_khw = require("../../models/khwaahish/category.model");
const Products_khw = require("../../models/khwaahish/product.model");
const { deleteFileFromS3 } = require("../../services/S3_Services");

const addCategory = async (req, res) => {
  const nav_image = req?.navImageUrl;
  const image = req.imageUrl;
  try {
    const { name, description, showInNav } = req.body;
    if (!name) throw new Error("Enter Category Name");

    // Create new Category
    const newCategory = new Category_khw({ name, description, image, nav_image, showInNav });
    await newCategory.save();

    res.status(200).json({ message: "Category Added Successfully" });
  } catch (error) {
    if (image?.key) {
      deleteFileFromS3(image.key)
    }
    if (nav_image?.key) {
      deleteFileFromS3(nav_image.key)
    }
    res.status(400).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const data = await Category_khw.find({})
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const image = req?.imageUrl;
  const nav_image = req?.navImageUrl;
  try {
    const id = req?.params?.id;
    const { name, description, showInNav } = req.body;
    if (!name) throw new Error("Enter Category Name");
    const data = await Category_khw.findById(id)
    if (!data) throw new Error("Category not exist!")
    if (image?.key) {
      data?.image?.key && deleteFileFromS3(data?.image?.key)
      data.image = image
    }
    if (nav_image?.key) {
      data?.nav_image?.key && deleteFileFromS3(data?.nav_image?.key)
      data.nav_image = nav_image
    }
    data.name = name
    data.description = description
    data.showInNav = showInNav
    await data.save()
    res.status(200).json({ message: "Updated Successfully" })
  } catch (error) {
    if (image?.key) {
      deleteFileFromS3(image.key)
    }
    if (nav_image?.key) {
      deleteFileFromS3(nav_image.key)
    }
    res.status(400).json({ error: error.message });
  }
}

const getCategoryByName = async(req,res)=>{
  try {
    const name = req?.params?.name;
    if(!name) throw new Error("Name not found")
    const data = await Category_khw.findOne({name:{ $regex: new RegExp(`^${name}$`, "i") }})
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteCategory = async (req, res) => {
  try {
    const id = req?.params?.id;
    const category = await Category_khw.findById(id)
    if (!category) throw new Error("Category is not exist!")
    if (category?.image?.key) {
      deleteFileFromS3(category.image?.key)
    }
    if(category?.nav_image?.key){
      deleteFileFromS3(category.nav_image.key)
    }
    await Category_khw.deleteOne({ _id: category._id })
    await Products_khw.deleteMany({ category: id })
    res.status(200).json({ message: "Deleted Successfully" })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addCategory, getAllCategories, updateCategory,getCategoryByName, deleteCategory };
