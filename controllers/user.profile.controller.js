const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const { sendOTPViaSMS,sendOTPViaEmail } = require("../services/otpService");
const redisClient = require("../config/redis.js");
const JWT = require("jsonwebtoken");
const Address = require("../models/adresss.model.js");

const generateOTP = require("../utils/otpGenerator"); // Use this for Fake OTP in Testing Mode

// Forgot Password Phone Otp , Phone Otp verify and Passkey

const phoneOtp = async (req, res) => {
  try {
    const _id = req?.user?.id;

    const user = await User.findOne({ _id: _id });
    if (!user) throw new Error("This phone number is not registered!");

    const phone = user.phone;

    //user can not regenerate otp before 30 secondss
    const redisOtp = await redisClient.get(`OTP-${phone}`);
    const ttl = await redisClient.ttl(`OTP-${phone}`);
    if (redisOtp && ttl > 0) throw new Error(`Please wait ${ttl} seconds before requesting a new OTP!`);

    //genereate otp and send via sms
    const OTP = generateOTP();
    // IN PRODUCTION: sendOTPViaSMS(phone, OTP);

    const hashedOTP = await bcrypt.hash(OTP, 10);

    // store otp in redis for user can not regenerate otp before  2 min
    await redisClient.set(`OTP-${phone}`, hashedOTP, { EX: 2 * 60 });

    res.status(200).json({ message: "Otp send successfully", otp: OTP });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const phoneOtpVerifyAndChangePassword = async (req, res) => {
  try {
    const { otp, password } = req.body;

    if (!otp) throw new Error("Please Enter Otp!");
    if (!password) throw new Error("Please enter your new password!");
    if (password.length < 8 || password.length > 12) throw new Error("Password must be between 8 and 12 characters in length!");

    const _id = req?.user?.id;
    const user = await User.findOne({ _id: _id });
    if (!user) throw new Error("This phone number is not registered!");

    const phone = user.phone;

    const redisOtp = await redisClient.get(`OTP-${phone}`);
    if (!redisOtp) throw new Error("Otp Expired!");

    const verifyOtp = await bcrypt.compare(otp, redisOtp);
    if (!verifyOtp) throw new Error("Invalid Otp!");

    await redisClient.del(`OTP-${phone}`);

    // Hash password for security purpose
    const hashedPassword = await bcrypt.hash(password, 10);

    // save hashed password in db
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password change successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePasswordViaPasskey = async (req, res) => {
  try {
    const { password, passkey } = req.body;

    const _id = req?.user?.id;
    const user = await User.findOne({ _id: _id }).select("+password");
    if (!user) throw new Error("This phone number is not registered!");

    if (!password) throw new Error("Please enter your new password!");
    if (!passkey) throw new Error("Please enter your passkey!");
    if (password.length < 8 || password.length > 12) throw new Error("Password must be between 8 and 12 characters in length!");

    const verifyPasskey = await bcrypt.compare(passkey, user.password);
    if (!verifyPasskey) throw new Error("Wrong Passkey!");

    // Hash password for security purpose
    const hashedPassword = await bcrypt.hash(password, 10);

    // save hashed password in db
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Reset Password Successfully" });
  } catch (error) {
    if (error.message === "jwt expired") {
      res.status(400).json({ message: "Token has expired, please request a new one!" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};





// Add a new address
const addAddress = async (req, res) => {
    try {
        const { country, street_address, city, state, pin_code, type } = req.body;
        const userId = req.user.id;  // Extracted from JWT

        const newAddress = new Address({ country, street_address, city, state, pin_code, type });
        await newAddress.save();

        await User.findByIdAndUpdate(userId, { $push: { addresses: newAddress._id } });

        res.status(201).json({ message: "Address added successfully", newAddress });
    } catch (error) {
        res.status(500).json({ message: "Error adding address", error });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const updatedData = req.body;
        
        const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, { new: true });

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address updated successfully", updatedAddress });
    } catch (error) {
        res.status(500).json({ message: "Error updating address", error });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;

        const address = await Address.findByIdAndDelete(addressId);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { addresses: addressId } });

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting address", error });
    }
};

// Get all addresses for a users
const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("addresses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses", error });
    }
};

const emailOtp = async(req,res)=>{
  try {
    const {email} = req.body
    if(!email) throw new Error("Please Enter your email!")
    const _id = req?.user?.id;
    if(!_id) throw new Error("Unauthorized User!")

    //user can not regenerate otp before 30 secondss
    const redisOtp = await redisClient.get(`Email-otp-${_id}`);
    const ttl = await redisClient.ttl(`Email-otp-${_id}`);
    if (redisOtp && ttl > 0) throw new Error(`Please wait ${ttl} seconds before requesting a new OTP!`);

    const otp = generateOTP()
    sendOTPViaEmail(email,otp)

    // store otp in redis for user can not regenerate otp before  2 min
    const hashedOTP = await bcrypt.hash(otp,10)
    await redisClient.set(`Email-otp-${_id}`, JSON.stringify({ email: email, otp: hashedOTP }), { EX: 2 * 60 });
    res.status(200).json({message:"Otp send successfully to your email id!",otp:otp})
  } catch (error) {
    console.log(error)
    res.status(400).json({error:error.message})
  }
}

const emailOtpVerify = async(req,res)=>{
  try {
    const {email,otp} = req.body
    if(!email) throw new Error("Please Enter your email!")
    if(!otp) throw new Error("Enter your otp")
    const _id = req?.user?.id;
    if(!_id) throw new Error("Unauthorized User!")

    const redis = await redisClient.get(`Email-otp-${_id}`);
    const redisOtp = JSON.parse(redis)
    if (!redisOtp) throw new Error("Otp Expired!");

    const verifyOtp = await bcrypt.compare(otp, redisOtp.otp);
    if (!verifyOtp || email!==redisOtp.email) throw new Error("Invalid Otp!");

    const user = await User.findById(_id)
    user.email_verified = true
    await user.save()

    await redisClient.del(`Email-otp-${_id}`);
    res.status(200).json({message:"Email verified successfully"})
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

const updateName = async(req,res)=>{
  try {
    const {name} = req.body
    if(!name) throw new Error("Please Enter your name!")
    const _id = req?.user?.id;
    if(!_id) throw new Error("Unauthorized User!")
    const user = await User.findById(_id)
    user.name = name
    await user.save()
    res.status(200).json({message:"Name update successfully"})
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}



module.exports = {
  phoneOtp,
  phoneOtpVerifyAndChangePassword,
  changePasswordViaPasskey,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  emailOtp,
  emailOtpVerify,
  updateName
};
