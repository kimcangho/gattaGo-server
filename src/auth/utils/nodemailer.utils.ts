import nodemailer from "nodemailer";

interface MailOptionsData {
  from?: string;
  to: string;
  subject: string;
  text: string;
  email: string;
  html: string;
  attachments: {
    filename: string;
    path: string;
    cid: string;
  }[];
}

const sendEmail = (
  email: string,
  subject: string,
  text: string,
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

  const htmlData = `<h1>Hi ${email},</h1>`;

  const mailOptions: MailOptionsData = {
    from: process.env.HOST_GMAIL,
    to: email,
    subject: `${subject} ${email}`,
    text,
    email,
    html: htmlData,
    attachments: [
      {
        filename: "gattaGo.svg",
        path: `https://res.cloudinary.com/di7kiyj3y/image/upload/v1693665208/gattaGo-boat_lnwjf6.svg`,
        cid: "gattago-logo",
      },
    ],
  };
  transporter.sendMail(mailOptions, (err, _success) => {
    if (err) console.log(err);
    else console.log("Email sent!");
  });
};

export { sendEmail };
