const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false, trim: true },
  phone: { type: String, unique: true, sparse: true },
  phone_verified: { type: Boolean, default: false },
  email: { type: String, unique: true, sparse: true, trim:true},
  email_verified: { type: Boolean, default: false },
  password: { type: String, select: false },

  status: { type: String, enum: ["Active", "Inactive", "Banned"], default: "Inactive" },
  roles: { type: [String], enum: ["Admin", "User", "Manager"], default: ["User"] },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: false },

  profile: {
    key: { type: String },
    secure_url: { type: String, default: "http://default-profile.jpg" },
  },
  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canEditContent: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
  }
},{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
