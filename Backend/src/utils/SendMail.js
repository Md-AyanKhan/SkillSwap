import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID?.trim(),
    pass: process.env.APP_PASSWORD?.trim().replace(/\s+/g, ''),
  },
});

// Test the transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
    console.error("EMAIL_ID:", process.env.EMAIL_ID?.trim());
    console.error("APP_PASSWORD length:", process.env.APP_PASSWORD?.trim().replace(/\s+/g, '').length);
  } else {
    console.log("Email transporter is ready to send emails");
  }
});

const sendMail = async (to, subject, Message) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: [to],
    subject: subject,
    html: Message,
  };

  try {
    console.log("Attempting to send email from:", process.env.EMAIL_ID);
    console.log("Sending email to:", to);
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", result.response);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error while sending email:", error.message);
    console.error("Full error:", error);
    return { success: false, error: error.message };
  }
};

export { sendMail };
