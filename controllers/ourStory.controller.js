const OurStory = require("../models/ourStory.js");
const path = require("path");
const fs = require("fs");
// const { deleteFileByLocationFromS3 } = require("../services/S3_Services.js");

// Helper function to delete file from local storage
const deleteLocalFile = (filePath) => {
  try {
    if (!filePath) return;
    const fullPath = path.join(__dirname, "../", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`File deleted: ${fullPath}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};


// ourstory
// Desire Section
exports.getOurStory = async (req, res) => {
     try{
        console.log("Jjjh");
        
        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }
        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Toggle section visibility
exports.toggleOurStory = async (req, res) => {
    try {
      const { section, value } = req.body;
      
      
      if (section === undefined || value === undefined) {
        return res.status(400).json({ success: false, message: "Section name and value are required" });
      }
      
      // List of valid section fields
      const validSections = [
        'our_desire_section',
        'our_logo_section',
        'our_value_section',
        'our_promoter_section',
      ];
      
      if (!validSections.includes(section)) {
        return res.status(400).json({ success: false, message: "Invalid section name" });
      }
      
      let ourStory = await OurStory.findOne({ page:"Our Story" });
      if (!ourStory) {
          ourStory = new OurStory({ page:"Our Story" });
          await ourStory.save();
      }
  
      // Create update object
      const updateData = {};
      updateData[section] = value === true || value === 'true';
  
      const updated = await OurStory.findOneAndUpdate(
        { page:"Our Story" },
        updateData,
        { new: true }
      );
  
      res.status(200).json({ 
        success: true, 
        message: `Section ${section} visibility updated successfully`,
        data: updated
      });
    } catch (error) {
      console.error("Error toggling section visibility:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Desire Section
exports.updateOurDesire = async (req, res) => {
    try {
        console.log(req.body); // This should now contain your form fields
        console.log(req.file);  // This should contain your file information
        
        const { desire_title ,desire_descriptions} = req.body;
        
        let desire_image;
        if (req.file) {
            // desire_image = req.file.location;
            desire_image = req.file.path;
        }
        
        if(!desire_title || desire_descriptions.length === 0){
            return res.status(400).json({success:false, message:"All fields Are required"});
        }


        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }

        if (desire_image && ourStory.desire_image) {
            // await deleteFileByLocationFromS3(ourStory.desire_image);
            deleteLocalFile(ourStory.desire_image);

        }

        if(desire_image) ourStory.desire_title = desire_title;
        if(desire_descriptions)ourStory.desire_descriptions =desire_descriptions;
        if(desire_image)ourStory.desire_image = desire_image;

        await ourStory.save();
        console.log(ourStory);
        

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.addDesireFeat = async (req, res) => {
    try {
        const { title, descripton } = req.body;

        if (!title || !descripton) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }

        ourStory.desire_feat.push({ title, descripton });
        await ourStory.save();

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.deleteDesireFeat = async (req, res) => {
    try {
        const { id } = req.params;

        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }
        ourStory.desire_feat = ourStory.desire_feat.filter(feat => feat._id.toString() !== id);
        await ourStory.save();

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Logo section
exports.updateOurLogo = async (req, res) => {
    try {
        const { logo_title, logo_short_desc, logo_desc_1, logo_desc_2, logo_message } = req.body;
        let logo_img;

        if (req.file) {
            // logo_img = req.file.location;
            logo_img = req.file.path;
        }

        let ourStory = await OurStory.findOne({ page: "Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page: "Our Story" });
            await ourStory.save();
        }

        if (logo_img && ourStory.logo_img) {
            // await deleteFileByLocationFromS3(ourStory.logo_img)
            deleteLocalFile(ourStory.logo_img);
        }

        if (logo_title !== undefined) ourStory.logo_title = logo_title;
        if (logo_short_desc !== undefined) ourStory.logo_short_desc = logo_short_desc;
        if (logo_desc_1 !== undefined) ourStory.logo_desc_1 = logo_desc_1;
        if (logo_desc_2 !== undefined) ourStory.logo_desc_2 = logo_desc_2;
        if (logo_message !== undefined) ourStory.logo_message = logo_message;
        if (logo_img) ourStory.logo_img = logo_img;

        await ourStory.save();

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Value section
exports.updateOurValue=async(req,res)=>{
    try {
        const {  our_value_section_title } = req.body;
        if (!our_value_section_title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        let ourStory = await OurStory.findOne({ page: "Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page: "Our Story" });
            await ourStory.save();
        }
        ourStory.our_value_section_title=our_value_section_title;
        await ourStory.save();
        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.addValue=async(req,res)=>{
    try{
    const { title, desc } = req.body;

    if (!title || !desc) {
        return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    let ourStory = await OurStory.findOne({ page:"Our Story" });
    if (!ourStory) {
        ourStory = new OurStory({ page:"Our Story" });
        await ourStory.save();
    }

    ourStory.values_list.push({ title, desc });
    await ourStory.save();

    res.status(200).json({ success: true, data: ourStory });
} catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
}
}

exports.deleteValue=async(req,res)=>{
    try {
        const { id } = req.params;

        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }

        ourStory.values_list = ourStory.values_list.filter(feat => feat._id.toString() !== id);
        await ourStory.save();

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// promoters 
exports.updatePromoter=async(req,res)=>{
    try {
        const {  our_promoter_section_title } = req.body;
        if (!our_promoter_section_title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        let ourStory = await OurStory.findOne({ page: "Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page: "Our Story" });
            await ourStory.save();
        }
        ourStory.our_promoter_section_title=our_promoter_section_title;
        await ourStory.save();
        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.addpromoter=async(req,res)=>{
    try{
    const {  name,
    designation,//file URL 
    feedback}= req.body;

    console.log(req.body);

    

    if(!name || !designation || !feedback){
        return res.status(400).json({success:false,message:"All fields are required "});
    }

    let profileImg;
    if(req.file){
        // profileImg=req.file.location;
        profileImg=req.file.path;
    }
    

    if (!name || !designation || !feedback) {
        return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    let ourStory = await OurStory.findOne({ page:"Our Story" });
    if (!ourStory) {
        ourStory = new OurStory({ page:"Our Story" });
        await ourStory.save();
    }
    
    let addData={
        name,
        designation,
        feedback
    };
    if(profileImg) addData.profileImg=profileImg;
    

    

    ourStory.promoters_list.push(addData);
    await ourStory.save();

    res.status(200).json({ success: true, data: ourStory });
} catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
}
}

exports.deletepromoter=async(req,res)=>{
    try {
        const { id } = req.params;

        let ourStory = await OurStory.findOne({ page:"Our Story" });
        if (!ourStory) {
            ourStory = new OurStory({ page:"Our Story" });
            await ourStory.save();
        }
        deletePromoterObj = ourStory.promoters_list.filter(feat => feat._id.toString() == id);
        deleteLocalFile(deletePromoterObj[0].profileImg);
        ourStory.promoters_list = ourStory.promoters_list.filter(feat => feat._id.toString() !== id);
        
        await ourStory.save();

        res.status(200).json({ success: true, data: ourStory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



