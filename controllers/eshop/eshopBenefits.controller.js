const EshopBenefit = require("../../models/eshop/eshopBenefits.model");
const { deleteFileFromS3 } = require("../../services/S3_Services"); // adjust the path as needed

// Create a new benefit
exports.createBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    // Local storage 
    // const image = req.file ? `/uploads/benefits/${req.file.filename}` : null;

    // S3 storage
    const image = req.file ? { key: req.file.key, url: req.file.location } : null;

    const newBenefit = new EshopBenefit({ title, description, image });
    await newBenefit.save();
    res.status(201).json(newBenefit);
  } catch (error) {
    res.status(500).json({ message: "Error creating benefit", error });
  }
};

// Get all benefits
exports.getBenefits = async (req, res) => {
  try {
    const benefits = await EshopBenefit.find();
    res.status(200).json(benefits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching benefits", error });
  }
};

// Update a benefit
exports.updateBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedData = { title, description };

    // Local storage
    // if (req.file) {
    //   updatedData.image = `/uploads/benefits/${req.file.filename}`;
    // }
    
    // S3 storage
    if (req.file) {
      updatedData.image = { key: req.file.key, url: req.file.location };
    }

    const updatedBenefit = await EshopBenefit.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedBenefit) return res.status(404).json({ message: "Benefit not found" });
    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(500).json({ message: "Error updating benefit", error });
  }
};

// Delete a benefit
exports.deleteBenefit = async (req, res) => {
  try {
    const benefit = await EshopBenefit.findById(req.params.id);
    if (!benefit) return res.status(404).json({ message: "Benefit not found" });

    // If using S3 storage, delete the file from S3
    if (benefit.image && benefit.image.key) {
      await deleteFileFromS3(benefit.image.key);
    }

    await EshopBenefit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Benefit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting benefit", error });
  }
};
