const CollectionAd = require("../../models/khwaahish/CollectionAd.js");
// const { deleteFileByLocationFromS3 } = require("../../services/S3_Services.js");

const allowedCollectionHomepage = ["Aasai","Noor", "Bridal Edit", "Polki Edit","Pache"];


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

// Main CollectionAd CRUD operations
exports.getCollectionAd = async (req, res) => {
    try {
         const { collection_homepage_name } = req.query;

        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }
       
        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }
        
        res.status(200).json({ success: true, data: collectionAd });
    } catch (error) {
        console.error("Error fetching CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updateGeneral = async (req, res) => {
    try {
        
        const { collection_homepage_name, hero_desc, collection_name, ad_title, slug } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (hero_desc !== undefined) updateData.hero_desc = hero_desc;
        if (collection_name !== undefined) updateData.collection_name = collection_name;
        if (ad_title !== undefined) updateData.ad_title = ad_title;
        if (slug !== undefined) updateData.slug = slug;

        const fileFields = ['hero_desktop_banner_img', 'hero_mobile_banner_img', 'collection_logo', 'ad_video'];
        for (const field of fileFields) {
            if (req.files && req.files[field]) {
                if (collectionAd[field]) {
                    // await deleteFileByLocationFromS3(collectionAd[field]);
                    deleteLocalFile(collectionAd[field]);
                }
                // updateData[field] = req.files[field][0].location.replace(/\\/g, '/');
                updateData[field] = req.files[field][0].path.replace(/\\/g, '/');
            }
        }

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updateCollection = async (req, res) => {
    try {

        
        const { collection_homepage_name, collection_data_section_title, collection_data_title, collection_data_desc } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }
        

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (collection_data_section_title !== undefined) updateData.collection_data_section_title = collection_data_section_title;
        if (collection_data_title !== undefined) updateData.collection_data_title = collection_data_title;
        if (collection_data_desc !== undefined) updateData.collection_data_desc = collection_data_desc;

        if (req.file) {
            if (collectionAd.collection_data_image) {
                //await deleteFileByLocationFromS3(collectionAd.collection_data_image);
                deleteLocalFile(collectionAd.collection_data_image);
            }
            // updateData['collection_data_image'] = req.files['collection_data_image'][0].location.replace(/\\/g, '/');
            updateData['collection_data_image'] = req.file.path.replace(/\\/g, '/');
        }

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updateJewelAtGlance = async (req, res) => {
    try {
        
        const { collection_homepage_name, jewel_at_glance_title, jewel_at_glance_desc } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (jewel_at_glance_title !== undefined) updateData.jewel_at_glance_title = jewel_at_glance_title;
        if (jewel_at_glance_desc !== undefined) updateData.jewel_at_glance_desc = jewel_at_glance_desc;

        if (req.files && req.files['jewel_at_glance_images']) {
            if (collectionAd.jewel_at_glance_images && collectionAd.jewel_at_glance_images.length > 0) {
                collectionAd.jewel_at_glance_images.forEach(imagePath => {
                    //await deleteFileByLocationFromS3(imagePath);
                    deleteLocalFile(imagePath);
                });
            }
            // updateData['jewel_at_glance_images'] = req.files['jewel_at_glance_images'].map(file => file.location.replace(/\\/g, '/'));
            updateData['jewel_at_glance_images'] = req.files['jewel_at_glance_images'].map(file => file.path.replace(/\\/g, '/'));
        }

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updateCategorySection = async (req, res) => {
    try {
        
        const { collection_homepage_name, category_section_title, category_section_desc } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (category_section_title !== undefined) updateData.category_section_title = category_section_title;
        if (category_section_desc !== undefined) updateData.category_section_desc = category_section_desc;

        if (req.files && req.files['category_section_images']) {
            if (collectionAd.category_section_images && collectionAd.category_section_images.length > 0) {
                collectionAd.category_section_images.forEach(imagePath => {
                    //await deleteFileByLocationFromS3(imagePath);
                    deleteLocalFile(imagePath);
                });
            }
            updateData['category_section_images'] = req.files['category_section_images'].map(file => file.path.replace(/\\/g, '/'));
            // updateData['category_section_images'] = req.files['category_section_images'].map(file => file.location.replace(/\\/g, '/'));
        }

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.updateTopicSection = async (req, res) => {
    try {
        
        const { collection_homepage_name, topic_section_title } = req.body;
        
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (topic_section_title !== undefined) updateData.topic_section_title = topic_section_title;

        
        
        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );
        
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating topic section:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// updated
exports.addTopic = async (req, res) => {
    try {
        
        const { collection_homepage_name, topicTitle, topicDesc } = req.body;
        topic={};
        if (!collection_homepage_name || !topicTitle || !topicDesc) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
    
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        topic.topicTitle=topicTitle;
        topic.topicDesc=topicDesc;

        if (req.files && req.files['topicImages']) {
            // topic.topicImages = req.files['topicImages'].map(file => file.location.replace(/\\/g, '/'));
            topic.topicImages = req.files['topicImages'].map(file => file.path.replace(/\\/g, '/'));
        }
        collectionAd.topics = collectionAd.topics.concat(topic);
        await collectionAd.save();

        res.json({ success: true, data: collectionAd });
    } catch (error) {
        console.error("Error adding topics:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.deleteTopic = async (req, res) => {
    try {
        
        const { collection_homepage_name ,id } = req.query;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        const topicToDelete = collectionAd.topics.find(topic => topic._id.toString() === id);
        if (topicToDelete && topicToDelete.topicImages) {
            topicToDelete.topicImages.forEach(imagePath => {
                //await deleteFileByLocationFromS3(imagePath);
                deleteLocalFile(imagePath);
            });
        }

        collectionAd.topics = collectionAd.topics.filter(topic => topic._id.toString() !== id);
        await collectionAd.save();

        res.json({ success: true, data: collectionAd });
    } catch (error) {
        console.error("Error deleting topics:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.updateCuratorThought = async (req, res) => {
    try {
        
        const { collection_homepage_name, curator_thought_section_title, curator_name, curator_thought_desc } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        let updateData = {};
        if (curator_thought_section_title !== undefined) updateData.curator_thought_section_title = curator_thought_section_title;
        if (curator_name !== undefined) updateData.curator_name = curator_name;
        if (curator_thought_desc !== undefined) updateData.curator_thought_desc = curator_thought_desc;

        if (req.files && req.files['curator_profileImg']) {
            if (collectionAd.curator_profileImg) {
                //await deleteFileByLocationFromS3(collectionAd.curator_profileImg);
                deleteLocalFile(collectionAd.curator_profileImg);
            }
            // updateData['curator_profileImg'] = req.files['curator_profileImg'][0].location.replace(/\\/g, '/');
            updateData['curator_profileImg'] = req.files['curator_profileImg'][0].path.replace(/\\/g, '/');
        }

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating CollectionAd:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.toggleSection = async (req, res) => {
    try {
        
        const { collection_homepage_name, section, value } = req.body;
        if (!allowedCollectionHomepage.includes(collection_homepage_name)) {
            return res.status(400).json({ success: false, message: "Invalid collection homepage name" });
        }

        if (section === undefined || value === undefined) {
            return res.status(400).json({ success: false, message: "Section name and value are required" });
        }

        const validSections = [
            'general_section',
            'jewel_at_glance_section',
            'collection_data_section',
            'category_section',
            'topic_section',
            'curator_thought_section'
        ];

        if (!validSections.includes(section)) {
            return res.status(400).json({ success: false, message: "Invalid section name" });
        }

        let collectionAd = await CollectionAd.findOne({ collection_homepage_name });
        if (!collectionAd) {
            collectionAd = new CollectionAd({ collection_homepage_name });
            await collectionAd.save();
        }

        const updateData = {};
        updateData[section] = value === true || value === 'true';

        const updated = await CollectionAd.findOneAndUpdate(
            { collection_homepage_name },
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