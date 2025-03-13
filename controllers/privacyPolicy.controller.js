const express = require("express");
const PrivacyPolicy = require("../models/privacyPolicy.js");

// Get Privacy Policy
const getPrivacyPolicy= async (req, res) => {
    try {
        const policy = await PrivacyPolicy.findOne();
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Update or Create Privacy Policy
const updatePrivacyPolicy= async (req, res) => {
    const { greeting, privacy_list } = req.body;

    try {
        let policy = await PrivacyPolicy.findOne();

        if (policy) {
            policy.greeting = greeting;
            policy.privacy_list = privacy_list;
        } else {
            policy = new PrivacyPolicy({ greeting, privacy_list });
        }

        await policy.save();
        res.json({ message: "Privacy Policy Updated", policy });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {getPrivacyPolicy,updatePrivacyPolicy};
