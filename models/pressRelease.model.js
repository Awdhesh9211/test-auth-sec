// models/PressRelease.js
const mongoose = require('mongoose');

const pressReleaseSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,  //  Date type for proper date sorting
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    key:String,
    url:String
  }
}, {
  timestamps: true,  // Keeps createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Format the date field to YYYY-MM-DD when sending response
      ret.date = ret.date.toISOString().split('T')[0];
      return ret;
    }
  }
});

// Add index on date field for better query performance
pressReleaseSchema.index({ date: -1 });

const PressRelease = mongoose.model('PressRelease', pressReleaseSchema);

module.exports = PressRelease;






// const mongoose = require('mongoose');

// const pressReleaseSchema = new mongoose.Schema({
//   image: { type: String, required: true },
//   date: { type: String, required: true },
//   topic: { type: String, required: true },
//   url: { type: String, required: true }
// }, { timestamps: true });

// const PressRelease = mongoose.model('PressRelease', pressReleaseSchema);

// module.exports = PressRelease;
