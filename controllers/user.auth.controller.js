const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const { generateToken } = require("../utils/jwtUtils");
const { sendOTPViaSMS, sendOTPViaEmail } = require("../services/otpService");
const redisClient = require("../config/redis");

const generateOTP = require("../utils/otpGenerator"); // Use this for Fake OTP in Testing Mode
const generateRandomPassword = require("../utils/generatePassKey.js");

/**
 * 📱 Register via Phone - Send OTP & Store in User Schema
 */
const registerPhoneOTP = async (req, res) => {
  try {
    // Extract the phone number from the request body
    console.log("Request Body:", req.body);
    const { phone } = req.body;
    console.log("phone:", phone);

    // Validate phone number (you can add more validation for phone format if needed)
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if the user already exists in the database
    let user = await User.findOne({ phone });

    // If the user does not exist, create a new user
    if (!user) {
      user = await User.create({ phone });
    }

    // If the user already exists and the phone is verified, return a message
    if (user.phone && user.phone_verified) {
      return res
        .status(202)
        .json({ message: "User already registered and verified." });
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

    // Send OTP to the user's phone number
    // IN PRODUCTION: sendOTPViaSMS(phone, otp);

    // Respond back with OTP sent success
    res.status(202).json({ message: "OTP SENT SUCCESS", otp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 📱 Verify OTP, Save User & Generate JWT
 */
const registerPhoneOTPVerify = async (req, res) => {
  try {
    // Extract phone and OTP from request body
    const { phone, otp } = req.body;

    // Fetch user by phone number (assuming phone is unique)
    let user = await User.findOne({ phone }).select("+password");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the user already exists and the phone is verified, return a message
    if (user.phone && user.phone_verified) {
      return res
        .status(202)
        .json({ message: "User already registered and verified." });
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

    // Generate a random passkey
    const passkey = generateRandomPassword();

    // Hash the passkey before storing
    const hashed_passkey = await bcrypt.hash(passkey, 10);

    // Update user details
    user.password = hashed_passkey;
    user.phone_verified = true;
    await user.save();

    // Generate JWT token (assuming generateToken function exists)
    const token = generateToken(user);

    // Set JWT token in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "Strict", // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 hour expiry
      path: "/", 
    });

    // Respond with success message and passkey
    res.status(200).json({
      message: "Registration successful",
      passkey, // Return passkey only for confirmation purposes (never store/display it insecurely)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 📱 send  OTP
 */
const loginPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

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

    // Send OTP to the user's phone number
    // IN PRODUCTION: sendOTPViaSMS(phone, otp);

    res.status(202).json({ message: "OTP SENT SUCCESS", otp });
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

const loginPhonePasskey = async (req, res) => {
  try {
    const { phone, passkey } = req.body;

    // Validate phone and passkey
    if (!phone || !passkey) {
      return res
        .status(400)
        .json({ message: "Phone number and passkey are required." });
    }

    // Fetch user from DB
    const user = await User.findOne({ phone }).select("+password");
    if (!user || !user.phone_verified) {
      return res
        .status(404)
        .json({ message: "User not found or phone not verified." });
    }

    // Compare provided passkey with stored hashed password
    const isMatch = await bcrypt.compare(passkey, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid passkey." });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set JWT token in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000 * 24 * 7, // 1 Week expiry
      path: "/",
    });

    res.status(200).json({ message: "Login successful" });
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
    // IN PRODUCTION: sendOTPViaSMS(phone, otp);

    res.status(202).json({ message: "OTP SENT SUCCESS", otp });
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
  registerPhoneOTP,
  registerPhoneOTPVerify,
  loginEmailOTP,
  loginEmailOTPVerify,
  loginPhoneOTP,
  loginPhoneOTPVerify,
  loginPhonePasskey,
  logout,
  Adminprofile
};
