const LandingPage = require("../../models/eshop/landingpage.model.js"); // Mongoose model
const { deleteFileByLocationFromS3 } = require("../../services/S3_Services")


// Helper function to delete file from local storage
const deleteLocalFile = (filePath) => {
  try {
    if (!filePath) return;
    const fullPath = path.join(__dirname, "../../", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`File deleted: ${fullPath}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};


const landingPageUpdate=async (req, res) => {
    try {
        const {
            scroll_text,
            brand_web_link,
            logo_text,
            hero_short_desc,
            hero_desc,
            hero_message,
            ad_title,
            ad_desc,
            trending_title,
            trending_desc,
            trending_slug,
            trending_slug_name,
            lagacy_title,
            legacy_desc_1,
            legacy_desc_2,
            curator_title,
            curator_desc_1,
            curator_desc_2,
            promise_title,
            promise_desc,
            promises_list
        } = req.body;
        let page=await LandingPage.findOne({eshop_name:"Gulz"});
        if(!page){
            page=new LandingPage({eshop_name:"Gulz"});
            await page.save()
        }
        let updateData = {};
      
        // return res.json("kkkk");

        if(scroll_text) updateData.scroll_text=scroll_text;
        if(brand_web_link) updateData.brand_web_link=brand_web_link;
        if(logo_text) updateData.logo_text=logo_text;
        if(hero_short_desc) updateData.hero_short_desc=hero_short_desc;
        if(hero_desc) updateData.hero_desc=hero_desc;
        if(hero_message) updateData.hero_message=hero_message;
        if(ad_title) updateData.ad_title=ad_title;
        if(ad_desc) updateData.ad_desc=ad_desc;
        if(trending_title) updateData.trending_title=trending_title;
        if(trending_desc) updateData.trending_desc=trending_desc;
        if(trending_slug) updateData.trending_slug=trending_slug;
        if(trending_slug_name) updateData.trending_slug_name=trending_slug_name;
        if (lagacy_title) updateData.lagacy_title = lagacy_title;
        if (legacy_desc_1) updateData.legacy_desc_1 = legacy_desc_1;
        if (legacy_desc_2) updateData.legacy_desc_2 = legacy_desc_2;
        if (curator_title) updateData.curator_title = curator_title;
        if (curator_desc_1) updateData.curator_desc_1 = curator_desc_1;
        if (curator_desc_2) updateData.curator_desc_2 = curator_desc_2;
        if (promise_title) updateData.promise_title = promise_title;
        if (promise_desc) updateData.promise_desc = promise_desc;
        if (promises_list) updateData.promises_list = promises_list;

        const fileFields = ['logo', 'hero_desktop_img', 'hero_mobile_img', 'ad_video','trending_img','legacy_img', 'curator_img'];
        
        for (const field of fileFields) {
            if (req.files[field]) {
            if (page[field]) {
                // deleteFileByLocationFromS3(page[field]);
                deleteLocalFile(page[field]);
            }
            // updateData[field] = req.files[field][0].location;
            updateData[field] = req.files[field][0].path;
            }
        }
        const updated=await LandingPage.findOneAndUpdate({eshop_name:"Gulz"},updateData,{ new: true, upsert: true })
        
        
        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating landing page:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Add a new promise
const addPromise = async (req, res) => {
    try {
      const { description } = req.body;
      let page = await LandingPage.findOne({ eshop_name: "Gulz" });
      if (!page) {
          page = new LandingPage({ eshop_name: "Gulz" });
          await page.save();
      }
      
      let promise = {};
      if(description) promise.description=description;
      // const image = req.file ? req.file.location : '';
      const image = req.file ? req.file.path : '';
      if(image) promise.image=image;
      const landingPage = await LandingPage.findOne({ eshop_name: "Gulz" });
      landingPage.promises_list.push(promise);
      await landingPage.save();
      res.status(201).json({ message: 'Promise added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add promise' });
    }
};
  
// Delete a promise
const deletePromise = async (req, res) => {
    try {
    const { id } = req.params;
      
    const landingPage = await LandingPage.findOne({ eshop_name: "Gulz" });
    const promise = landingPage.promises_list.id(id);
    if (!promise) {
        return res.status(404).json({ message: 'Promise not found' });
    }
    if(promise.image){
        // deleteFileByLocationFromS3(promise.image);
        deleteLocalFile(promise.image);
    }
    landingPage.promises_list = landingPage.promises_list.filter(p => p.id !== id);
    await landingPage.save();
    res.status(200).json({ message: 'Promise deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete promise' });
    }
};



const getLandingpage=async(req,res)=>{
    try {
        const landingPage=await LandingPage.findOne({eshop_name:"Gulz"});
        res.status(200).send({message:"success",landingPage});
    } catch (error) {
        console.error("Error updating landing page:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const toggleSection = async (req, res) => {
    try {
      const { section, value } = req.body;
      
      
      if (section === undefined || value === undefined) {
        return res.status(400).json({ success: false, message: "Section name and value are required" });
      }
      
      
      // List of valid section fields
      const validSections = [
        "general_section",
        "hero_section",
        // Ads Section
        "ads_section",
        // Legacy Section
        "legacy_section",
        // Curators Tales Section
        "curator_section",
        // Promise Section
        "promise_section",
        // Trending Section
        "trending_section",
      
      ];
      
      if (!validSections.includes(section)) {
        return res.status(400).json({ success: false, message: "Invalid section name" });
      }
      
      let landingPage = await LandingPage.findOne({ eshop_name:"Gulz" });
      if (!landingPage) {
        landingPage = new LandingPage({eshop_name:"Gulz"});
        await landingPage.save();
      }
  
      // Create update object
      const updateData = {};
      updateData[section] = value === true || value === 'true';
  
      const updated = await LandingPage.findOneAndUpdate(
        { eshop_name:"Gulz" },
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


module.exports = {landingPageUpdate,getLandingpage,addPromise,deletePromise,toggleSection}