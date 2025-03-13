const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    country: { type: String, required: true },
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin_code: { type: String, required: true },
});

module.exports = mongoose.model("Address", AddressSchema);
