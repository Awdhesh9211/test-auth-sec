const mongoose = require("mongoose");

const CollectionAdSchema = new mongoose.Schema(
  {
  // General
  // Noor / Heer / Kiara / Bridal / Polki / Aasai
  collection_homepage_name:{ type: String,},
  general_section:{type:Boolean,default:false},
  hero_desktop_banner_img: { type: String,},//file URL
  hero_mobile_banner_img: { type: String,},//file URL
  hero_desc:{ type: String, trim: true,},
  collection_name:{ type: String, trim: true,},
  collection_logo:{ type: String,},   // file URL
  ad_title:{ type: String,},
  ad_video:{ type: String,},// file URL
  slug:{ type: String,},

  // collection section 
  collection_data_section:{type:Boolean,default:false},
  collection_data_section_title:{ type: String,},
  collection_data_title:{ type: String,},
  collection_data_desc:{ type: String,},
  collection_data_image:{ type: String,},

 
  // Jewel at glance 
  jewel_at_glance_section:{type:Boolean,default:true},
  jewel_at_glance_title:{ type: String,},
  jewel_at_glance_desc:{ type: String,},
  jewel_at_glance_images:[{ type: String,},],

  // category section 
  category_section:{type:Boolean,default:true},
  category_section_title:{ type: String,},
  category_section_desc:{ type: String,},
  category_section_images:[{ type: String,},],

  // topics 
  topic_section:{type:Boolean,default:true},
  topic_section_title:{ type: String,},
  topics:[
    {
        topicTitle:{ type: String,},
        topicDesc:{ type: String,},
        topicImages:[{ type: String,},]
    }
  ],

  // curator thought section
  curator_thought_section:{type:Boolean,default:true},
  curator_thought_section_title:{ type: String,},
  curator_profileImg:{ type: String,},
  curator_name:{ type: String,},
  curator_thought_desc:{ type: String,},  
},
  { timestamps: true } 
);

module.exports = mongoose.model("CollectionHomepage_khwaahish", CollectionAdSchema);