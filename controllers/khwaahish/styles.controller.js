const Products_khw = require("../../models/khwaahish/product.model");
const Style_khw = require("../../models/khwaahish/style.model");

const addStyle = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name) throw new Error("Enter Style Name")
    const newStyle = new Style_khw({ name });
    await newStyle.save();
    res.status(200).json({ message: "Style Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllStyles = async (req, res) => {
  try {
    const data = await Style_khw.find({})
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStyle = async(req,res)=>{
  try {
    const id = req.params?.id;
    const { name } = req.body;
    if(!name) throw new Error("Enter Style Name")
    const style = await Style_khw.findById(id)
    if(!style) throw new Error("Style not exist!")
    style.name = name 
    await style.save()
    res.status(200).json({message:"Update Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteStyle = async(req,res)=>{
  try {
    const id = req.params?.id;
    if(!id) throw new Error("Style id not found!")
    const style = await Style_khw.findById(id)
    if(!style) throw new Error("Style not exist!")
    await Style_khw.deleteOne({_id:style._id})
    await Products_khw.deleteMany({style:id})
    res.status(200).json({message:"Deleted Successfully"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addStyle,getAllStyles,updateStyle,deleteStyle };
