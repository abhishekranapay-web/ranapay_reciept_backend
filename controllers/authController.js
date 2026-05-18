
const { generateOTP, sendOTP } = require('../services/otpService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
require('dotenv').config();

// --- USER AUTH ---

const requestOTP = async (req, res) => {
    try {


        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);

        await Otp.findOneAndUpdate(
            { email: process.env.EMAIL },
            { otpHash, createdAt: new Date() },
            { upsert: true, new: true }
        );

        await sendOTP(process.env.EMAIL, otp);
        res.json({ status: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        const otpRecord = await Otp.findOne({ email: process.env.EMAIL });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }



        await Otp.deleteOne({ _id: otpRecord._id });

        const accessToken = jwt.sign(
            { email: process.env.EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'success',
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    requestOTP,
    verifyOTP,

};
