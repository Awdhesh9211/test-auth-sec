const mongoose = require("mongoose");

const OurStorySchema = new mongoose.Schema(
  {
  page:{ type: String,default:"Our Story"},

//   OUR DESIRE SECTION
  our_desire_section:{type:Boolean,default:false},
  desire_title: { type: String,},
  desire_descriptions: [{ type: String,}],
  desire_image: { type: String,},//file URL
  desire_feat:[
    {
        title:{ type: String,},
        descripton:{ type: String,},
    }
  ],

//   OUR LOGO
  our_logo_section:{type:Boolean,default:false},
  logo_title:{ type: String,},
  logo_img:{ type: String,}, //file URL
  logo_short_desc:{ type: String,},
  logo_desc_1:{ type: String,},
  logo_desc_2:{ type: String,},
  logo_message:{ type: String,},

//   OUR VALUE 
  our_value_section:{type:Boolean,default:false},
  our_value_section_title:{ type: String,},
  values_list:[
    {
        title:{ type: String,},
        desc:{ type: String,},
    }
  ],

//   OUR PROMOTERS
  our_promoter_section:{type:Boolean,default:false},
  our_promoter_section_title:{ type: String,},
  promoters_list:[
    {
        name:{ type: String,},
        designation:{ type: String,},
        profileImg:{ type: String,},//file URL 
        feedback:{ type: String,},
    }
  ]

 
},
  { timestamps: true } 
);

module.exports = mongoose.model("ourstory_page", OurStorySchema);