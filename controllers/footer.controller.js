// controllers/footerController.js
const Footer = require('../models/footer.model.js');
const { deleteFileByLocationFromS3 } = require('../services/S3_Services');

// @desc    Get all footers
// @route   GET /api/footers
// @access  Private
exports.getFooters = async (req, res) => {
    try{
    const footers = await Footer.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: footers.length,
        data: footers
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};

// @desc    Get single footer
// @route   GET /api/footers/:id
// @access  Private
exports.getFooter = async (req, res) => {
    try{
    const footer = await Footer.findById(req.params.id);
    
    if (!footer) {
        return res.status(404).json({
            success: false,
            error: 'Footer not found'
        });
    }
    
    res.status(200).json({
        success: true,
        data: footer
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};

// @desc    Get footer by domain
// @route   GET /api/footers/domain/:domain
// @access  Public
exports.getFooterByDomain = async (req, res) => {
    try{
    const footer = await Footer.findOne({ domain: req.params.domain });
    
    if (!footer) {
        return res.status(404).json({
            success: false,
            error: 'Footer not found for this domain'
        });
    }
    
    res.status(200).json({
        success: true,
        data: footer
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};

// @desc    Create new footer
// @route   POST /api/footers
// @access  Private
exports.createFooter = async (req, res) => {
    try{
    // Check if a footer with this domain already exists
    const existingFooter = await Footer.findOne({ domain: req.body.domain });
    
    if (existingFooter) {
        return res.status(400).json({
            success: false,
            error: 'A footer for this domain already exists'
        });
    }

    // Handle file upload
    if (req.file) {
        req.body.available_payment_methods = req.file.location;
    }
    
    const footer = await Footer.create(req.body);
    
    res.status(201).json({
        success: true,
        data: footer
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};

// @desc    Update footer
// @route   PUT /api/footers/:id
// @access  Private
exports.updateFooter =async (req, res) => {
    try{
    let footer = await Footer.findById(req.params.id);
    
    if (!footer) {
        return res.status(404).json({
            success: false,
            error: 'Footer not found'
        });
    }
    
    // If domain is being changed, check if new domain already exists
    if (req.body.domain && req.body.domain !== footer.domain) {
        const domainExists = await Footer.findOne({ domain: req.body.domain });
        
        if (domainExists) {
            return res.status(400).json({
                success: false,
                error: 'A footer for this domain already exists'
            });
        }
    }

    // Handle file upload
    if (req.file) {
        if(domainExists.available_payment_methods){
            deleteFileByLocationFromS3(domainExists.available_payment_methods)
        }
        req.body.available_payment_methods = req.file.path;
    }
    
    footer = await Footer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: footer
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};

// @desc    Delete footer
// @route   DELETE /api/footers/:id
// @access  Private
exports.deleteFooter = async (req, res) => {
    try{
    const footer = await Footer.findById(req.params.id);
    
    if (!footer) {
        return res.status(404).json({
            success: false,
            error: 'Footer not found'
        });
    }
    ["available_payment_methods"].forEach(field => {
        if (footer[field]) deleteFileByLocationFromS3(footer[field]);
    })
    
    await footer.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
} catch (error) {
    res.status(500).json({ message: "Server Error" });
}
};