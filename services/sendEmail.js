const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

// set API key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendOTP(email, otp) {
  try {
    const sendSmtpEmail = {
      sender: {
        name: "BlogIt",
        email: "blogit.read@gmail.com", // verified sender
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Your OTP Code",
      htmlContent: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("OTP email sent");
  } catch (error) {
    console.error("Brevo error:", error);
    throw error;
  }
}

module.exports = sendOTP;
