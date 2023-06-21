import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const sendEmail = (
  email: string,
  subject: string,
  text: string,
  file: string,
  resetCode?: string
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
    { email, resetCode },
    (err, data) => {
      if (err) console.log(err);
      else {
        const mailOptions = {
          from: process.env.HOST_GMAIL,
          to: email,
          subject: `${subject} ${email}`,
          text,
          email,
          html: data,
          attachments: [{
            filename: 'gattaGo.png',
            path: path.join(__dirname + '/../../public/gattaGo-boat.png'),
            cid: 'gattago-logo'
          }]
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
