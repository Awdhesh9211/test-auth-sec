const Category_khw = require("../../models/khwaahish/category.model.js");
const Style_khw = require("../../models/khwaahish/style.model.js");
const Product_khw = require("../../models/khwaahish/product.model.js");
const { deleteFileFromS3 } = require("../../services/S3_Services.js");

const addProduct = async (req, res) => {
  try {
    req.body = JSON.parse(req?.body?.productData);

    const { name, sku, collection, category } = req.body;

    if (!name) throw new Error("Enter Name");
    if (!sku) throw new Error("Enter Sku");
    if (!collection) throw new Error("Select Collection");
    if (!category) throw new Error("Select Category");

    req.body.style = req.body.style || null;

    req.body.images = req.imageUrls || [];

    await Product_khw({ ...req.body}).save();

    res.status(200).json({ message: "Added successfully" });
  } catch (error) {
    if (req?.imageUrls?.length > 0) {
      req.imageUrls.map((obj) => {
        deleteFileFromS3(obj.key)
      })
    }
    res.status(400).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { _id, collection, category, style, page,limit } = req.body;

    let filter = {};
    const skip = (page - 1) * limit; 

    if (_id) filter._id = _id;
    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    if (style) filter.style = style;

    if(limit && page){
      const [uniqueCategories, uniqueStyles,totalRecords] = await Promise.all([
        Product_khw.distinct("category", filter),
        Product_khw.distinct("style", filter),
        Product_khw.countDocuments(filter), 
      ]);
  
      const categories = await Category_khw.find({ _id: { $in: uniqueCategories } }).select("name");
      const styles = await Style_khw.find({ _id: { $in: uniqueStyles } }).select("name");
  
      const data = await Product_khw.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
      res.status(200).json({ products: data, categories: categories, styles: styles, totalRecords });
    }else{
      const data = await Product_khw.find(filter).sort({ createdAt: -1 });
      res.status(200).json({ products: data });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const _id = req.params?.id;
    if (!_id) throw new Error("Product Id not found!");
    const data = await Product_khw.findById(_id).populate(["collection", "category", "style"]);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductByName = async(req,res)=>{
  try {
    const name = req?.params?.name 
    const data = await Product_khw.findOne({name:{ $regex: new RegExp(`^${name}$`, "i") }}).populate(["collection","category","style"])
    if(!data) throw new Error("Product Not found")
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getProductForUpdate = async (req, res) => {
  try {
    const _id = req.params?.id;
    if (!_id) throw new Error("Product Id not found!");
    const data = await Product_khw.findById(_id);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const _id = req.params?.id;
    const product = await Product_khw.findById(_id)
    req.body = JSON.parse(req?.body?.productData);

    const { name, sku, collection, category } = req.body;

    if (!name) throw new Error("Enter Name");
    if (!sku) throw new Error("Enter Sku");
    if (!collection) throw new Error("Select Collection");
    if (!category) throw new Error("Select Category");

    delete req.body["images"]

    const updateData = {};

    if (req.imageUrls && req.imageUrls.length > 0) {
      updateData.images = req.imageUrls;
      product.images.map((obj) => {
        deleteFileFromS3(obj.key)
      })
    }

    req.body.style = req.body.style || null;

    await Product_khw.findByIdAndUpdate(_id, { ...req.body, ...updateData })

    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    if (req.imageUrls.length > 0) {
      req.imageUrls.map((obj) => {
        deleteFileFromS3(obj.key)
      })
    }
    res.status(400).json({ error: error.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const id = req.params?.id
    const product = await Product_khw.findById(id)
    if (!product) throw new Error("Product not found!")
    product.images.map((obj) => {
      deleteFileFromS3(obj.key)
    })
    await Product_khw.findByIdAndDelete(product._id)
    res.status(200).json({ message: "Deleted Successfully" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


module.exports = { addProduct, getProducts, getProductById,getProductByName,getProductForUpdate, updateProduct, deleteProduct };
