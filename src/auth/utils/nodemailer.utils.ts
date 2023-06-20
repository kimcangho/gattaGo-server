import nodemailer from "nodemailer";

const sendEmail = (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.HOST_GMAIL,
      pass: process.env.HOST_GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.HOST_GMAIL,
    to: email,
    subject: `${subject} ${email}`,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (err, _success) => {
    if (err) console.log(err);
    else console.log("Email sent!");
  });
};

export { sendEmail };
