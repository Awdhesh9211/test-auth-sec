const Homepage = require("../../models/khwaahish/Homepage.js");
// const { deleteFileByLocationFromS3 } = require("../../services/S3_Services.js");

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

// Main Homepage CRUD operations
const getHomepage = async (req, res) => {
  try {
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
        homepage = new Homepage({ homepage_name: "Khwaahish" });
        await homepage.save();
    }
    res.status(200).json({ success: true, data: homepage });
  } catch (error) {
    console.error("Error fetching homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updateGeneral=async(req,res)=>{
  try{
    const {
     // general
     scroll_text,
     eshop_web_link,
     store_mapLink,
     hero_short_desc,
     hero_desc, }=req.body;

    // Find existing homepage or create new one
    
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // Handle text fields
    if (scroll_text !== undefined) updateData.scroll_text = scroll_text;
    if (eshop_web_link !== undefined) updateData.eshop_web_link = eshop_web_link;
    if (store_mapLink !== undefined) updateData.store_mapLink = store_mapLink;
    if (hero_short_desc !== undefined) updateData.hero_short_desc = hero_short_desc;
    if (hero_desc !== undefined) updateData.hero_desc = hero_desc;

    // Handle file uploads
    const fileFields = ['logo', 'hero_video', ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        // Delete old file if exists
        if (homepage[field]) {
            //await deleteFileByLocationFromS3(homepage[field]);
            deleteLocalFile(homepage[field]);
        }
        // Save new file path
        // updateData[field] = req.files[field][0].location.replace(/\\/g, '/');
        updateData[field] = req.files[field][0].path.replace(/\\/g, '/');
      }
    }

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// update hallmarks 
const updateHallMark=async(req,res)=>{
  try{
    const {
      // hallmark
      hallmark_sec_desc,
      about_slug_name,
      about_slug, }=req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // hallmark 
    if (hallmark_sec_desc !== undefined) updateData.hallmark_sec_desc = hallmark_sec_desc;
    if (about_slug_name !== undefined) updateData.about_slug_name = about_slug_name;
    if (about_slug !== undefined) updateData.about_slug = about_slug;

    // Handle file uploads for multiple images
    if (req.files && req.files['hallmark_images']) {
      // Delete old hallmark images if new ones are provided
      if (homepage.hallmark_images && homepage.hallmark_images.length > 0) {
      homepage.hallmark_images.forEach(imagePath => {
        //await deleteFileByLocationFromS3(imagePath);
        deleteLocalFile(imagePath);
      });
      }
      // Save new file paths
      // updateData.hallmark_images = req.files['hallmark_images'].map(file => file.location.replace(/\\/g, '/'));
      updateData.hallmark_images = req.files['hallmark_images'].map(file => file.path.replace(/\\/g, '/'));
    }

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// update high jewel section 
const addHighJewel=async(req,res)=>{
  try{
    const {
      high_jewel_title,
      high_jewel_desc, }=req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // high jewel
    if (high_jewel_title !== undefined) updateData.high_jewel_title = high_jewel_title;
    if (high_jewel_desc !== undefined) updateData.high_jewel_desc = high_jewel_desc;

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};
// Add a new High Jewel 
const addHighJewelCarousal = async (req, res) => {
  try {
    const { high_title, high_short_desc, high_slug_name, high_slug } = req.body;
    if (!high_title || !high_short_desc || !high_slug_name || !high_slug) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    // const high_Image = req.file ? req.file.location.replace(/\\/g, '/') : null;
    const high_Image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    const newHighJewel = {
      high_Image,
      high_title,
      high_short_desc,
      high_slug_name,
      high_slug
    };

    homepage.high_jewel_list.push(newHighJewel);
    await homepage.save();

    res.status(201).json({ success: true, message: 'High Jewel added successfully', data: newHighJewel });
  } catch (error) {
    console.error("Error adding High Jewel:", error);
    res.status(500).json({ success: false, message: 'Failed to add High Jewel' });
  }
};

// Delete a High Jewel
const deleteHighJewelCarousal = async (req, res) => {
  try {
    const { id } = req.params;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const highJewelIndex = homepage.high_jewel_list.findIndex(item => item._id.toString() === id);
    if (highJewelIndex === -1) {
      return res.status(404).json({ success: false, message: 'High Jewel not found' });
    }

    const highJewel = homepage.high_jewel_list[highJewelIndex];
    if (highJewel.high_Image) {
      // deleteFileByLocationFromS3(highJewel.high_Image);
      deleteLocalFile(highJewel.high_Image);
    }

    homepage.high_jewel_list.splice(highJewelIndex, 1);
    await homepage.save();

    res.status(200).json({ success: true, message: 'High Jewel deleted successfully' });
  } catch (error) {
    console.error("Error deleting High Jewel:", error);
    res.status(500).json({ success: false, message: 'Failed to delete High Jewel' });
  }
};

// update high jewel section 
const QueenOfHeartSection=async(req,res)=>{
  try{
    const {
      qoh_section_title,
      qoh_section_short_desc, }=req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    if (qoh_section_title !== undefined) updateData.qoh_section_title = qoh_section_title;
    if (qoh_section_short_desc !== undefined) updateData.qoh_section_short_desc = qoh_section_short_desc;

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};
// Add a new High Jewel 
const addQOHCarousal = async (req, res) => {
  try {
    const { qohTitle, qohShort_desc, qoh_slug_name, qoh_slug } = req.body;
    if (!qohTitle || !qohShort_desc || !qoh_slug_name || !qoh_slug) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const qohImage = req.file ? req.file.location.replace(/\\/g, '/') : null;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    const newQOH = {
      qohImage,
      qohTitle,
      qohShort_desc,
      qoh_slug_name,
      qoh_slug
    };

    homepage.qoh_section_list.push(newQOH);
    await homepage.save();

    res.status(201).json({ success: true, message: 'High Jewel added successfully', data: newQOH });
  } catch (error) {
    console.error("Error adding High Jewel:", error);
    res.status(500).json({ success: false, message: 'Failed to add High Jewel' });
  }
};

// Delete a High Jewel
const deleteQOHCarousal = async (req, res) => {
  try {
    const { id } = req.params;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const QOHIndex = homepage.qoh_section_list.findIndex(item => item._id.toString() === id);
    if (QOHIndex === -1) {
      return res.status(404).json({ success: false, message: 'High Jewel not found' });
    }

    const QOH = homepage.qoh_section_list[QOHIndex];
    if (QOH.qohImage) {
      // deleteFileByLocationFromS3(QOH.qohImage);
      deleteLocalFile(QOH.qohImage);
    }

    homepage.qoh_section_list.splice(QOH, 1);
    await homepage.save();

    res.status(200).json({ success: true, message: 'High Jewel deleted successfully' });
  } catch (error) {
    console.error("Error deleting High Jewel:", error);
    res.status(500).json({ success: false, message: 'Failed to delete High Jewel' });
  }
};

// Bridal and polki
const updateEditSection=async (req, res) => {
  try {
    // Extract text fields from request body
    const {
      // bridal edit
      bridal_edit_section_title,
      bridal_edit_section_short_desc,
      bridal_edit_title,
      bridal_edit_short_desc,
      bridal_edit_slug_name,
      bridal_edit_slug,
      // polki edit 
      polki_edit_section_title,
      polki_edit_section_short_desc,
      polki_edit_title,
      polki_edit_short_desc,
      polki_edit_slug_name,
      polki_edit_slug,
    } = req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};
    // bridal 
    if (bridal_edit_section_title !== undefined) updateData.bridal_edit_section_title = bridal_edit_section_title;
    if (bridal_edit_section_short_desc !== undefined) updateData.bridal_edit_section_short_desc = bridal_edit_section_short_desc;
    if (bridal_edit_title !== undefined) updateData.bridal_edit_title = bridal_edit_title;
    if (bridal_edit_short_desc !== undefined) updateData.bridal_edit_short_desc = bridal_edit_short_desc;
    if (bridal_edit_slug_name !== undefined) updateData.bridal_edit_slug_name = bridal_edit_slug_name;
    if (bridal_edit_slug !== undefined) updateData.bridal_edit_slug = bridal_edit_slug;
    //polki 
    if (polki_edit_section_title !== undefined) updateData.polki_edit_section_title = polki_edit_section_title;
    if (polki_edit_section_short_desc !== undefined) updateData.polki_edit_section_short_desc = polki_edit_section_short_desc;
    if (polki_edit_title !== undefined) updateData.polki_edit_title = polki_edit_title;
    if (polki_edit_short_desc !== undefined) updateData.polki_edit_short_desc = polki_edit_short_desc;
    if (polki_edit_slug_name !== undefined) updateData.polki_edit_slug_name = polki_edit_slug_name;
    if (polki_edit_slug !== undefined) updateData.polki_edit_slug = polki_edit_slug;

    // Handle file uploads
    const fileFields = [ 
      'bridal_edit_image', 
      'polki_edit_image', 
    ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        // Delete old file if exists
        if (homepage[field]) {
          // deleteFileByLocationFromS3(homepage[field]);
          deleteLocalFile(homepage[field]);
        }
        // Save new file path
        // updateData[field] = req.files[field][0].location.replace(/\\/g, '/');
        updateData[field] = req.files[field][0].path.replace(/\\/g, '/');
      }
    }

    // Update homepage with the new data
    const updated = await Homepage.findOneAndUpdate(
      { homepage_name: "Khwaahish" }, 
      updateData, 
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// promise section 
const promiseSection = async (req, res) => {
  try {
    // Extract text fields from request body
    const {
      // promise 
      promise_sec_title,
      promise_short_desc,
    } = req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};
    // promise 
    if (promise_sec_title !== undefined) updateData.promise_sec_title = promise_sec_title;
    if (promise_short_desc !== undefined) updateData.promise_short_desc = promise_short_desc;

    // Update homepage with the new data
    const updated = await Homepage.findOneAndUpdate(
      { homepage_name: "Khwaahish" }, 
      updateData, 
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add a new promise
const addPromise = async (req, res) => {
  try {
    const { promise_title } = req.body;
    if (!promise_title) {
      return res.status(400).json({ success: false, message: 'Promise title is required' });
    }
    const promise_image = req.file ? req.file.location.replace(/\\/g, '/') : null;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    const newPromise = {
      promise_title,
      promise_image
    };

    homepage.promise_list.push(newPromise);
    await homepage.save();

    res.status(201).json({ success: true, message: 'Promise added successfully', data: newPromise });
  } catch (error) {
    console.error("Error adding promise:", error);
    res.status(500).json({ success: false, message: 'Failed to add promise' });
  }
};

// Delete a promise
const deletePromise = async (req, res) => {
  try {
    const { id } = req.params;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const promiseIndex = homepage.promise_list.findIndex(item => item._id.toString() === id);
    if (promiseIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promise not found' });
    }

    const promise = homepage.promise_list[promiseIndex];
    if (promise.promise_image) {
      // deleteFileByLocationFromS3(promise.promise_image);
      deleteLocalFile(promise.promise_image);
    }

    homepage.promise_list.splice(promiseIndex, 1);
    await homepage.save();

    res.status(200).json({ success: true, message: 'Promise deleted successfully' });
  } catch (error) {
    console.error("Error deleting promise:", error);
    res.status(500).json({ success: false, message: 'Failed to delete promise' });
  }
};

// Coming Soon Section 
const updateComingSoon=async(req,res)=>{
  try{
    const {
       // coming soon 
       coming_soon_section_title,
       videoCall_slug, }=req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

   // coming soon
   if (coming_soon_section_title !== undefined) updateData.coming_soon_section_title = coming_soon_section_title;
   if (videoCall_slug !== undefined) updateData.videoCall_slug = videoCall_slug;

    // Handle file uploads for multiple images
    if (req.files && req.files['coming_soon_images']) {
      // Delete old hallmark images if new ones are provided
      if (homepage.coming_soon_images && homepage.coming_soon_images.length > 0) {
      homepage.coming_soon_images.forEach(imagePath => {
        // deleteFileByLocationFromS3(imagePath);
        deleteLocalFile(imagePath);
      });
      }
      // Save new file paths
      // updateData.coming_soon_images = req.files['coming_soon_images'].map(file => file.location.replace(/\\/g, '/'));
      updateData.coming_soon_images = req.files['coming_soon_images'].map(file => file.path.replace(/\\/g, '/'));
    }
    if (req.files && req.files['coming_soon_videCall_banner_image']) {
      // Delete old file if exists
      if (homepage['coming_soon_videCall_banner_image']) {
        // deleteFileByLocationFromS3(homepage['coming_soon_videCall_banner_image']);
        deleteLocalFile(homepage['coming_soon_videCall_banner_image']);
      }
      // Save new file path
      // updateData['coming_soon_videCall_banner_image'] = req.files['coming_soon_videCall_banner_image'][0].location.replace(/\\/g, '/');
      updateData['coming_soon_videCall_banner_image'] = req.files['coming_soon_videCall_banner_image'][0].path.replace(/\\/g, '/');
    }

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// update store section 
const updateStoreSection=async(req,res)=>{
  try{
    const {
        // store 
      store_section_title,
      storeShort_desc,
      storeDesc,
      mapiframeLink
     }=req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // store 
    if (store_section_title !== undefined) updateData.store_section_title = store_section_title;
    if (storeShort_desc !== undefined) updateData.storeShort_desc = storeShort_desc;
    if (storeDesc !== undefined) updateData.storeDesc = storeDesc;
    if (mapiframeLink !== undefined) updateData.mapiframeLink = mapiframeLink;

    if (req.file) {
      // Delete old file if exists
      if (homepage['storeImage']) {
        // deleteFileByLocationFromS3(homepage['storeImage']);
        deleteLocalFile(homepage['storeImage']);
      }
      // Save new file path
      // updateData['storeImage'] = req.file.location.replace(/\\/g, '/');
      updateData['storeImage'] = req.file.path.replace(/\\/g, '/');
    }

  // Update homepage with the new data
  const updated = await Homepage.findOneAndUpdate(
    { homepage_name: "Khwaahish" }, 
    updateData, 
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
} catch (error) {
  console.error("Error updating homepage:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};

// Add a store feat
const addStoreFeat = async (req, res) => {
  try {
    const { featTitle, featDesc} = req.body;
    if (!featTitle || !featDesc ) {
      return res.status(400).json({ success: false, message: 'Promise title is required' });
    }

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    const newStoreFeat = {
      featTitle,
      featDesc
    };

    homepage.store_feat_list.push(newStoreFeat);
    await homepage.save();

    res.status(201).json({ success: true, message: 'Promise added successfully', data: newStoreFeat });
  } catch (error) {
    console.error("Error adding promise:", error);
    res.status(500).json({ success: false, message: 'Failed to add promise' });
  }
};

// Delete a store feat
const deleteStoreFeat = async (req, res) => {
  try {
    const { id } = req.params;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const storeFeatIndex = homepage.store_feat_list.findIndex(item => item._id.toString() === id);
    if (storeFeatIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promise not found' });
    }

    homepage.store_feat_list.splice(storeFeatIndex, 1);
    await homepage.save();

    res.status(200).json({ success: true, message: 'Promise deleted successfully' });
  } catch (error) {
    console.error("Error deleting promise:", error);
    res.status(500).json({ success: false, message: 'Failed to delete promise' });
  }
};

// Faq section 
const faqSection = async (req, res) => {
  try {
    // Extract text fields from request body
    const {
      faq_title
    } = req.body;

    // Find existing homepage or create new one
    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};
    // promise 
    if (faq_title !== undefined) updateData.faq_title = faq_title;


    // Update homepage with the new data
    const updated = await Homepage.findOneAndUpdate(
      { homepage_name: "Khwaahish" }, 
      updateData, 
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add a FAQ
const addFaq = async (req, res) => {
  try {
    const { question, answer} = req.body;
    if (!question || !answer ) {
      return res.status(400).json({ success: false, message: 'Promise title is required' });
    }

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Khwaahish" });
      await homepage.save();
    }

    const newFaq = {
      question,
      answer
    };

    homepage.faq_list.push(newFaq);
    await homepage.save();

    res.status(201).json({ success: true, message: 'Promise added successfully', data: newFaq });
  } catch (error) {
    console.error("Error adding promise:", error);
    res.status(500).json({ success: false, message: 'Failed to add promise' });
  }
};

// Delete a FAQ
const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
    if (!homepage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const faqIndex = homepage.faq_list.findIndex(item => item._id.toString() === id);
    if (faqIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promise not found' });
    }

    homepage.faq_list.splice(faqIndex, 1);
    await homepage.save();

    res.status(200).json({ success: true, message: 'Promise deleted successfully' });
  } catch (error) {
    console.error("Error deleting promise:", error);
    res.status(500).json({ success: false, message: 'Failed to delete promise' });
  }
};

// Toggle section visibility
const toggleSection = async (req, res) => {
    try {
      const { section, value } = req.body;
      
      
      if (section === undefined || value === undefined) {
        return res.status(400).json({ success: false, message: "Section name and value are required" });
      }
      
      // List of valid section fields
      const validSections = [
        'general_section',
        'hallmark_section',
        'high_jewel_collection_section',
        'qoh_section',
        'bridal_edit_section',
        'polki_edit_section',
        'spotlight_section',
        'promise_section',
        'coming_soon_section',
        'store_section',
        'store_feat_section',
        'faq_section'
      ];
      
      if (!validSections.includes(section)) {
        return res.status(400).json({ success: false, message: "Invalid section name" });
      }
      
      let homepage = await Homepage.findOne({ homepage_name: "Khwaahish" });
      if (!homepage) {
        homepage = new Homepage({ homepage_name: "Khwaahish" });
        await homepage.save();
      }
  
      // Create update object
      const updateData = {};
      updateData[section] = value === true || value === 'true';
  
      const updated = await Homepage.findOneAndUpdate(
        { homepage_name: "Khwaahish" },
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

module.exports= {
    getHomepage,
    updateGeneral,
    updateHallMark,
    addHighJewel,
    addHighJewelCarousal,
    deleteHighJewelCarousal,
    QueenOfHeartSection,
    addQOHCarousal,
    deleteQOHCarousal,
    updateEditSection,
    promiseSection,
    addPromise,
    deletePromise,
    updateComingSoon,
    updateStoreSection,
    addStoreFeat,
    deleteStoreFeat,
    faqSection,
    addFaq,
    deleteFaq,
    toggleSection
}
  
  