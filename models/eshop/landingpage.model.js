const mongoose = require("mongoose");

const LandingPageSchema = new mongoose.Schema(
  {
   // Hero Section
  eshop_name: { type: String, default: "Gulz", trim: true, maxlength: 100 },
  general_section:{type:Boolean,default:false},
  scroll_text: { type: String, trim: true, maxlength: 255 },
  brand_web_link: { type: String, trim: true,},
  logo: { type: String, trim: true, }, // File URL Validation
  logo_text: { type: String, trim: true, maxlength: 100 },
  
  hero_section:{type:Boolean,default:false},
  hero_desktop_img: { type: String, trim: true,  }, // File URL
  hero_mobile_img: { type: String, trim: true,  }, // File URL
  hero_short_desc: { type: String, trim: true, maxlength: 200 },
  hero_desc: { type: String, trim: true, maxlength: 500 },
  hero_message: { type: String, trim: true, maxlength: 255 },

  // Ads Section
  ads_section:{type:Boolean,default:false},
  ad_title: { type: String, trim: true, maxlength: 100 },
  ad_desc: { type: String, trim: true, maxlength: 500 },
  ad_video: { type: String, trim: true, }, // Video URL

  // Legacy Section
  legacy_section:{type:Boolean,default:false},
  legacy_img: { type: String, trim: true, }, // Image URL
  lagacy_title: { type: String, trim: true, maxlength: 100 },
  legacy_desc_1: { type: String, trim: true, maxlength: 500 },
  legacy_desc_2: { type: String, trim: true, maxlength: 500 },

  // Curators Tales Section
  curator_section:{type:Boolean,default:false},
  curator_img: { type: String, trim: true, }, // Image URL
  curator_title: { type: String, trim: true, maxlength: 100 },
  curator_desc_1: { type: String, trim: true, maxlength: 500 },
  curator_desc_2: { type: String, trim: true, maxlength: 500 },

  // Promise Section
  promise_section:{type:Boolean,default:false},
  promise_title: { type: String, trim: true, maxlength: 100 },
  promise_desc: { type: String, trim: true, maxlength: 500 },
  promises_list: [
    {
      image: { type: String, trim: true,  },
      description: { type: String, trim: true, maxlength: 255 },
    },
  ],

  // Trending Section
  trending_section:{type:Boolean,default:false},
  trending_img: { type: String, trim: true, },
  trending_title: { type: String, trim: true, maxlength: 200 },
  trending_desc: { type: String, trim: true, maxlength: 500 },
  trending_slug_name: { type: String, trim: true, maxlength: 200 },
  trending_slug: { type: String, trim: true, },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("LandingPage_eshop", LandingPageSchema);