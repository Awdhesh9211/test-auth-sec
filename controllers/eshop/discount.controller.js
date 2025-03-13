const Product_eshop = require("../../models/eshop/product.model");
const Discount_eshop = require("../../models/eshop/discount.model");

const applyDiscount = async (req, res) => {
  try {
    const discount_types = ["diamond_discount", "gold_discount", "discount_on_total"];
    const { product, collection, category, style, discount_on, percent, message } = req.body;

    if (!discount_on) throw new Error("Select Discount On!");
    if (!percent) throw new Error("Enter Persentage!");
    if (!discount_types.includes(discount_on)) throw new Error("Invalid discount type");

    let filterForDiscount = {};

    const fields = { product, collection, category, style };

    for (const key in fields) {
      if (fields[key]) {
        filterForDiscount[key] = fields[key];
      } else {
        filterForDiscount[key] = null;
      }
    }

    const isExist = await Discount_eshop.findOne({ ...filterForDiscount, discount_on });
    if (isExist) throw new Error("This Discount Already Exist!");
    const discount = await Discount_eshop({ ...filterForDiscount, discount_on, percent, discount_on, message }).save();

    let filter = {}

    if (product) filter._id = product;
    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    if (style) filter.style = style;

    const updateFiled = {};

    if (discount_on === "diamond_discount") updateFiled.diamond_discount = discount._id;
    else if (discount_on === "gold_discount") updateFiled.gold_discount = discount._id;
    else if (discount_on === "discount_on_total") updateFiled.discount_on_total = discount._id;

    await Product_eshop.updateMany(filter, { $set: updateFiled });

    res.status(200).json({ message: "Discount Applied Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const data = await Discount_eshop.find({}).select("_id collection category style product discount_on percent message").populate(["collection","category","style","product"]);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDiscount = async(req,res)=>{
  try {
    const id = req.params?.id;
    const {percent,message} = req.body 
    if (!percent) throw new Error("Enter Persentage!");
    await Discount_eshop.findByIdAndUpdate(id,{percent,message})
    res.status(200).json({message:"Updated Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteDiscount = async(req,res)=>{
  try {
    const id = req.params?.id;
    await Discount_eshop.findByIdAndDelete(id)
    res.status(200).json({message:"Deleted Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { applyDiscount, getAllDiscounts , updateDiscount, deleteDiscount};
