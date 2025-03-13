const PressRelease = require('../models/pressRelease.model');
const {deleteFileFromS3} = require("../services/S3_Services")

// Create a new press release with image upload
exports.createPressRelease = async (req, res) => {
  try {
    
    const { date, topic, url } = req.body;
    const image = req.imageUrl ? req.imageUrl: null;

    const newPressRelease = new PressRelease({ image,  date: new Date(date), topic, url });
    await newPressRelease.save();
    res.status(201).json(newPressRelease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update press release (with optional image update)
exports.updatePressRelease = async (req, res) => {
  try {
    const { date, topic, url } = req.body;
    const image = req.imageUrl ? req.imageUrl : null;

    const product = await PressRelease.findById(req.params.id)
    if(!product) throw new Error("Product not found!")

    if(image.key && product?.image?.key){
      await deleteFileFromS3(product.image.key)
    }
    
    product.date = new Date(date)
    product.image = image
    product.topic = topic
    product.url = url
    
    await product.save()
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all press releases
exports.getAllPressReleases = async (req, res) => {
  try {
    const pressReleases = await PressRelease.find().sort({ date: -1 });
    res.status(200).json(pressReleases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single press release by ID
exports.getPressReleaseById = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findById(req.params.id);
    if (!pressRelease) {
      return res.status(404).json({ message: 'Press Release not found' });
    }
    res.status(200).json(pressRelease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a press release
exports.deletePressRelease = async (req, res) => {
  try {
    const pressRelease = await PressRelease.findByIdAndDelete(req.params.id);
    if (!pressRelease) {
      return res.status(404).json({ message: 'Press Release not found' });
    }
    res.status(200).json({ message: 'Press Release deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
