const mongoose = require("mongoose");

const HomepagePageSchema = new mongoose.Schema(
  {
  // General
  homepage_name: { type: String, default: "Khwaahish", trim: true},
  general_section:{type:Boolean,default:true},
  scroll_text: { type: String, trim: true, },
  eshop_web_link: { type: String, trim: true,},
  store_mapLink: { type: String, trim: true,},
  logo: { type: String, trim: true, }, // File URL Validation
  hero_video: { type: String, trim: true,  }, // File URL
  hero_short_desc: { type: String, trim: true, },
  hero_desc: { type: String, trim: true,},

  
  // hallmark Section
  hallmark_section: { type: Boolean,default:false }, // Image URL
  hallmark_sec_desc: { type: String, trim: true },
  about_slug_name:{type:String,},
  about_slug:{type:String,},
  hallmark_images:[
    {
      type:String
    }
  ],
 

  // High Jewewllery Collection Section 
  high_jewel_collection_section:{type:Boolean,default:false},
  high_jewel_title:{ type: String, trim: true, },
  high_jewel_desc:{ type: String, trim: true, },
  // separate ----- add delete
  high_jewel_list:[
    {
      high_Image:{type:String},
      high_title:{ type: String, trim: true },
      high_short_desc:{ type: String, trim: true },
      high_slug_name:{type:String},
      high_slug:{type:String},
    }
  ],

  // Queen Of Heart section 
  qoh_section:{type:Boolean,default:false},
  qoh_section_title:{ type: String, trim: true },
  qoh_section_short_desc:{ type: String, trim: true, },
  // separate ----- add delete update functionality api
  qoh_section_list:[
    {
      qohImage:{type:String},
      qohTitle:{ type: String, trim: true, },
      qohShort_desc:{ type: String, trim: true, },
      qoh_slug_name:{type:String},
      qoh_slug:{type:String}
    }
  ],

  // Bridal Edit 
  bridal_edit_section:{type:Boolean,default:false},
  bridal_edit_section_title:{ type: String, trim: true,},
  bridal_edit_section_short_desc:{ type: String, trim: true,  },
  bridal_edit_image:{ type: String, trim: true,  },
  bridal_edit_title:{ type: String, trim: true, },
  bridal_edit_short_desc:{ type: String, trim: true },
  bridal_edit_slug_name:{type:String},
  bridal_edit_slug:{type:String},

  // Polki Edits 
  polki_edit_section:{type:Boolean,default:false},
  polki_edit_section_title:{ type: String, trim: true },
  polki_edit_section_short_desc:{ type: String, trim: true },
  polki_edit_image:{ type: String, trim: true },
  polki_edit_title:{ type: String, trim: true },
  polki_edit_short_desc:{ type: String, trim: true },
  polki_edit_slug_name:{type:String},
  polki_edit_slug:{type:String},

  // Spotlight Ads Section
  spotlight_section:{type:Boolean,default:false},
  spotlight_title: { type: String, trim: true },
  spotlight_video: { type: String, trim: true, }, // Video URL

  // Promise Section
  promise_section:{type:Boolean,default:false},
  promise_sec_title:{ type: String, trim: true },
  promise_short_desc:{ type: String, trim: true },
  // --- separate add and delete functionality 
  promise_list:[
    {
      promise_title:{ type: String, trim: true},
      promise_image:{ type: String},
    }
  ],

  // Coming soon section 
  coming_soon_section:{type:Boolean,default:false},
  coming_soon_section_title:{ type: String, trim: true },
  coming_soon_images:[{ type: String,}],
  coming_soon_videCall_banner_image:{ type: String,},
  videoCall_slug:{ type: String},

  // Store Section 
  store_section:{type:Boolean,default:false},
  store_section_title:{type:String},
  storeShort_desc:{ type: String, trim: true },
  storeDesc:{ type: String, trim: true, },
  storeImage:{ type: String},
  mapiframeLink:{ type: String, trim: true },

  // Store feature section 
  store_feat_section:{ type: Boolean,default:true},
  store_feat_list:[
    {
      featTitle:{ type: String, trim: true, },
      featDesc:{ type: String, trim: true, },
    }
  ],

  // FAQ Section
  faq_section:{ type: Boolean,default:true},
  faq_title:{ type:String,trim:true},
  // always update 
  faq_list:[
    {
      question:{ type: String, trim: true, },
      answer:{ type: String, trim: true,},
    }
  ]

},
  { timestamps: true } 
);

module.exports = mongoose.model("Homepage_khwaahish", HomepagePageSchema);