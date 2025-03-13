const mongoose = require('mongoose');

const TermsAndConditionsSchema = new mongoose.Schema({
  term_desc_1: {
    type: String,
    required: true
  },
  term_desc_2: {
    type: String,
    required: true
  },
  termList: [{
    term: {
      type: String,
      required: true
    },
    conditions: {
      type: [String],
      default: []
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the 'updatedAt' field
TermsAndConditionsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TermsAndConditions', TermsAndConditionsSchema);