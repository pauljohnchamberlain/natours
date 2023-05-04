const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // gmail is a service, but it is not recommended
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME, // email address
      pass: process.env.EMAIL_PASSWORD, // password
    },
    // Activate in gmail "less secure app" option
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Paul Chamberlain <paul@kaizenbrands.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
