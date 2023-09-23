import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./generateEmailTemplate.utils";

interface MailOptionsData {
  from?: string;
  to: string;
  subject: string;
  email: string;
  html: string;
}

const sendEmail = (email: string, subject: string, resetCode?: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.HOST_GMAIL,
      pass: process.env.HOST_GMAIL_PASSWORD,
    },
  });

  const sendEmailData: string = generateEmailTemplate(email, resetCode);

  const mailOptions: MailOptionsData = {
    from: process.env.HOST_GMAIL,
    to: email,
    subject: `${subject} ${email}`,
    email,
    html: sendEmailData,
  };

  transporter.sendMail(mailOptions, (err, _success) => {
    if (err) console.log(err);
  });
};

export { sendEmail };
