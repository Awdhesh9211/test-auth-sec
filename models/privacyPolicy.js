const mongoose = require("mongoose");

const PrivacyPolicySchema = new mongoose.Schema({
    greeting: { type: String, required: true },
    privacy_list: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("PrivacyPolicy", PrivacyPolicySchema);