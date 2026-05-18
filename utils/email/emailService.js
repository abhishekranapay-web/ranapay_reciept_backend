 
const { SendMailClient } = require("zeptomail");
const config = require("../../config");

 

// const transporter = createTransporter();

/**
 * Send Email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @param {Array} options.attachments - Attachments (optional)
 */



const client = new SendMailClient({
    url: "https://api.zeptomail.in/v1.1/email",
    token: "Zoho-enczapikey PHtE6r0LFO3jiTUq8UQDsfC5EZb1NI199OxhKAdAtdoQXvNSS01QqNwskWThrkx5BvgWEPeSwY05sb/Ou+nRJjrkY2odX2qyqK3sx/VYSPOZsbq6x00etV0Zf0zdXIDvdt9v1ibTutveNA=="
});







const sendEmail = async (options) => {
    try {
        const response = await client.sendMail({
            from: {
                address: "noreply@bookourbus.com",
                // config.email.fromEmail,
                name: config.email.fromName
            },
            to: [
                {
                    email_address: {
                        address: options.to,
                        name: "abhsihek"
                    }
                }
            ],
            subject: options.subject,
            htmlbody: options.html
        });

        console.log("Email sent via ZeptoMail API");
        return { success: true, response };

    } catch (error) {
        console.error("❌ ZeptoMail API Error:", error);
        throw error;
    }
};





module.exports = {
    sendEmail
};
