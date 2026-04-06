import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'SwiftRide <noreply@swiftride.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional: if you want to send styled HTML emails
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};