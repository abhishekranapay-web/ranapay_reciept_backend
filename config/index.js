require('dotenv').config();

const config = {
 
 

  email: {
    service: process.env.EMAIL_SERVICE || 'smtp',
    fromEmail: process.env.EMAIL_FROM || 'noreply@bookourbus.in',
    fromName: process.env.EMAIL_FROM_NAME || 'BookOurBus',
    // SMTP Configuration
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || 587,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    // 
    zeptoUser: process.env.ZEPTO_USER,
    zeptoPass: process.env.ZEPTO_PASS,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
},
};

module.exports = config;