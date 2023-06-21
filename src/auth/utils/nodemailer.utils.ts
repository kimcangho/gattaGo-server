import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const sendEmail = (
  email: string,
  subject: string,
  text: string,
  resetCode: string,
  file: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.HOST_GMAIL,
      pass: process.env.HOST_GMAIL_PASSWORD,
    },
  });

  ejs.renderFile(
    path.join(__dirname + `/../../views/${file}.ejs`),
    (err, data) => {
      if (err) console.log(err);
      else {
        const mailOptions = {
          from: process.env.HOST_GMAIL,
          to: email,
          subject: `${subject} ${email}`,
          text,
          html: data, email,
        };
        transporter.sendMail(mailOptions, (err, _success) => {
          if (err) console.log(err);
          else console.log("Email sent!");
        });
      }
    }
  );
};

export { sendEmail };
