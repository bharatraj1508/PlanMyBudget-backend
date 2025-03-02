const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, template, placeholders }) => {
  try {
    const templatePath = path.join(__dirname, "templates", `${template}.html`);
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders (e.g., {{name}}, {{verification_link}})
    if (placeholders) {
      Object.keys(placeholders).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g"); // Matches all occurrences of {{key}}
        htmlTemplate = htmlTemplate.replace(regex, placeholders[key]);
      });
    }
    const mail_option = {
      to,
      from: "no.reply2This@outlook.com",
      subject,
      html: htmlTemplate,
    };

    await sgMail.send(mail_option);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return false;
  }
};

module.exports = { sendEmail };
