const client = require("../config/twilio");
const transporter = require("../config/mailer");


// USE IN PRODUCTION
const sendOTPViaSMS = async (phone, otp) => {
    await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: phone,
    });
};

const sendOTPViaEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code From KHWAAHISH ",
        text: `Your OTP is: ${otp}`,
    });
};

module.exports = { sendOTPViaSMS, sendOTPViaEmail };
