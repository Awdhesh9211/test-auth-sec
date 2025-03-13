const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const { generateToken } = require("../utils/jwtUtils");
const { sendOTPViaSMS, sendOTPViaEmail } = require("../services/otpService");
const redisClient = require("../config/redis");

const generateOTP = require("../utils/otpGenerator"); // Use this for Fake OTP in Testing Mode


/**
 * 📱 send  OTP
 */
const loginPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    console.log("hdhdg");
    console.log(req.body);
    

    // Validate phone number
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if the user exists and is verified
    const user = await User.findOne({ phone });

    if (!user || !user.phone_verified) {
      return res
        .status(404)
        .json({ message: "User not found or phone not verified." });
    }
  
    if(!user.roles.includes("Admin")){
        return res
        .status(404)
        .json({ message: "Invalid Credential" });
    }

    if(user.phone != '+917738941646' ){
        return res
        .status(404)
        .json({ message: "Invalid Credential" });
    }



    // Check if OTP already exists and return remaining expiry time
    const existingOTP = await redisClient.get(`OTP-${phone}`);
    const ttl = await redisClient.ttl(`OTP-${phone}`);

    if (existingOTP && ttl > 0) {
      return res.status(429).json({
        ttl,
        message: `Please wait ${ttl} seconds before requesting a new OTP.`,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpiry = 2 * 60; // 2 minutes in seconds

    // Store OTP in Redis with expiry
    await redisClient.setEx(`OTP-${phone}`, otpExpiry, hashedOTP);

    console.log(phone,otp);
    
    // Send OTP to the user's phone number
    await sendOTPViaSMS(phone, otp);

    res.status(202).json({success:true, message: "OTP SENT SUCCESS" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginPhoneOTPVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Check if user exists and phone is verified
    const user = await User.findOne({ phone });
    if (!user || !user.phone_verified) {
      return res
        .status(404)
        .json({ message: "User not found or phone not verified." });
    }

    // Get OTP from Redis
    const storedOTP = await redisClient.get(`OTP-${phone}`);

    if (!storedOTP) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    const verifyOtp = await bcrypt.compare(otp, storedOTP);

    if (!verifyOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.del(`OTP-${phone}`);

    // Generate JWT token
    const token = generateToken(user);

    // Set JWT token in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000 * 24 * 7, // 1 Week expiry
      path: "/"
    });

    res.status(200).json({success:true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * 📱 send  OTP
 */
const loginEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    // Validate phone number
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if the user exists and is verified
    const user = await User.findOne({ email });

    if (!user || !user.email_verified) {
      return res
        .status(404)
        .json({ message: "User not found or email not verified." });
    }

    if(!user.roles.includes("Admin")){
        return res
        .status(404)
        .json({ message: "Invalid Credential" });
    }

    // if(user.email != "anupsuresh216@gmail.com"){
    //     return res
    //     .status(404)
    //     .json({ message: "Invalid Credential" });
    // }
    // if(user.email !=  "shubham@rittzdigital.com"){
    //   return res
    //   .status(404)
    //   .json({ message: "Invalid Credential" });
    // }
    if(user.email !=  "gaundawdhesh9211@gmail.com"){
      return res
      .status(404)
      .json({ message: "Invalid Credential" });
    }

    // Check if OTP already exists and return remaining expiry time
    const existingOTP = await redisClient.get(`OTP-${email}`);
    const ttl = await redisClient.ttl(`OTP-${email}`);

    if (existingOTP && ttl > 0) {
      return res.status(429).json({
        ttl,
        message: `Please wait ${ttl} seconds before requesting a new OTP.`,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpiry = 2 * 60; // 2 minutes in seconds

    // Store OTP in Redis with expiry
    await redisClient.setEx(`OTP-${email}`, otpExpiry, hashedOTP);

    // Send OTP to the user's phone number
    await sendOTPViaEmail(email, otp);

    res.status(202).json({ success:true, message: "OTP SENT SUCCESS" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginEmailOTPVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if user exists and phone is verified
    const user = await User.findOne({ email });
    if (!user || !user.email_verified) {
      return res
        .status(404)
        .json({ message: "User not found or email not verified." });
    }

    // Get OTP from Redis
    const storedOTP = await redisClient.get(`OTP-${email}`);

    if (!storedOTP) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    const verifyOtp = await bcrypt.compare(otp, storedOTP);

    if (!verifyOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.del(`OTP-${email}`);

    // Generate JWT token
    const token = generateToken(user);

    // Set JWT token in HTTP-only cookie
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   secure: true,//process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 60 * 60 * 1000 * 24 * 7, // 1 Week expiry
    //   path: "/"
    // });

    // Set JWT token in HTTPS-only cookie
    res.cookie("token", token, {
      httpOnly: true,  // Prevents client-side access
      secure: false,   // Set false for HTTP (development)
      sameSite: "lax", // Allows same-site requests
      maxAge: 24 * 60 * 60 * 1000 *7, // 7 day
    });

    res.status(200).json({success:true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * 🚀 Logout
 */
const logout = async(req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/", 
    });
    res.status(200).json({success:true, message: "Logged out successfully"});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin profile 
const Adminprofile=async(req, res) => {

  try {
    const user=await User.findById(req.user.id);
    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  loginEmailOTP,
  loginEmailOTPVerify,
  loginPhoneOTP,
  loginPhoneOTPVerify,
  logout,
  Adminprofile
};
