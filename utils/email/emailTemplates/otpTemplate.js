const { sendEmail } = require("../emailService");

/**
 * Generate OTP Email Template
 * @param {Object} data
 * @returns {string}
 */

const generateOtpEmail = ({ otp }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Login OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f5f5;
  font-family:Arial,sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="
          background:#ffffff;
          border-radius:10px;
          padding:40px 30px;
        ">

          <tr>
            <td>

              <p style="
                margin:0 0 20px;
                font-size:16px;
                color:#111827;
              ">
                Hi,
              </p>

              <p style="
                margin:0 0 25px;
                font-size:16px;
                color:#374151;
                line-height:1.7;
              ">
                <strong style="
                  font-size:28px;
                  letter-spacing:4px;
                  color:#0178D2;
                ">
                  ${otp}
                </strong>
                is the OTP for login.
              </p>

              <p style="
                margin:0 0 25px;
                font-size:14px;
                color:#6B7280;
                line-height:1.7;
              ">
                If not requested by you, please contact Mrityunjay.
              </p>

              <p style="
                margin:0;
                font-size:15px;
                color:#111827;
                line-height:1.8;
              ">
                Best,<br />
                Team Mrityunjay
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};


/**
 * Send OTP Email
 * @param {string} recipientEmail
 * @param {string} otp
 */
const sendOtpEmail = async (recipientEmail, otp) => {
  try {
    const html = generateOtpEmail({ otp });

    const result = await sendEmail({
      to: recipientEmail,
      subject: `Your OTP Code`,
      html,
      text: `Your OTP is ${otp}. It is valid for 15 minutes. Do not share it with anyone.`,
    });

    console.log("✓ OTP email sent:", recipientEmail);

    return result;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
};