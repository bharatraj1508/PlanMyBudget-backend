const { sendEmail } = require("../../utils/mailer/config");

const testEmail = async (req, res) => {
  try {
    const verificationLink = "https://your-app.com/verify-email"; // Replace with actual verification link
    const emailSent = await sendEmail({
      to: "bharat@yopmail.com",
      subject: "Welcome to Plan My Budget!",
      template: "welcome_email",
      placeholders: {
        name: "Bharat Raj Verma",
        verification_link: verificationLink,
      },
    });

    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send welcome email" });
    }

    return res.status(200).json({ message: "Welcome email sent successfully" });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { testEmail };
