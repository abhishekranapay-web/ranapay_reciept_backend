const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    otpHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Automatically delete after 10 minutes
    }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
