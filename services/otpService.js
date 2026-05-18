
const { sendOtpEmail } = require("../utils/email/emailTemplates/otpTemplate");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};


const sendOTP = async (email, otp) => {
    // Mocking email sending delay
    console.log(`Sending OTP ${otp} to email ${email}`);

    await sendOtpEmail(email, otp);
    return true;
};


module.exports = {
    generateOTP,
    sendOTP
};
