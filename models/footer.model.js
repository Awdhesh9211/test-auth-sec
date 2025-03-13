// models/Footer.js
const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: [true, 'Domain name is required'],
    unique: true,
    trim: true
  },
  contactUs: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    instaLink: {
      type: String,
      trim: true
    },
    facebookLink: {
      type: String,
      trim: true
    },
    youtubeLink: {
      type: String,
      trim: true
    },
    whatsappLink: {
      type: String,
      trim: true
    }
  },
  address: {
    type: String,
    trim: true
  },
  quicklinksAvailable: {
    blog: {
      type: Boolean,
      default: false
    },
    'our-story': {
      type: Boolean,
      default: false
    },
    'privacy-policy': {
      type: Boolean,
      default: false
    },
    term_and_condition: {
      type: Boolean,
      default: false
    }
  },
  footerBgColor: {
    type: String,
    default: '#000000',
    trim: true
  },
  footerTextColor: {
    type: String,
    default: '#ffffff',
    trim: true
  },
  // Payment methods contain image path
  available_payment_methods: {type: String},
  copy_right_text: {type: String},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Footer', FooterSchema);