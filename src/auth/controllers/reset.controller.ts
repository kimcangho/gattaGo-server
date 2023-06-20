import { Request, Response } from "express";
import { findUser } from "../services/reset.services";
import { sendEmail } from "../utils/nodemailer.utils";

interface MailOptions {
  from: String;
  to: String;
  subject: String;
  text: String;
}

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await findUser(email);
  } catch {
    return res
      .status(400)
      .send("Email does not exist! Cannot reset password...");
  }

  sendEmail(
    email,
    "Password reset for",
    "Looks like you want to reset your password. Click on the link below! Your link will expire within 10 minutes!",
    '<a href="http://localhost:5173/"><b>gattaGo Racing</b></a>'
  );

  res.status(200).send("Password reset code sent!");
};

const updatePassword = async (req: Request, res: Response) => {
  const { email, password, resetCode } = req.body;

  //    Search for email in DB
  //  if not found, send error code
  try {
    await findUser(email);
  } catch {
    return res
      .status(400)
      .send("Email does not exist! Cannot reset password...");
  }

  //    Search for resetCode in DB
  //  if not found, send error code
  //    if past expiration date, send error code and prompt client to request new code

  //  if found, update password field with new encrypted password using bcrypt
  //    then delete reset code
  //    send confirmation email to user with newly update password

  sendEmail(
    email,
    "Password successfully reset for",
    "Your password has been successfully reset!",
    '<p>Password successfully reset! <a href="http://localhost:5173/login"><b>Login Here</b></a></p>'
  );

  res.status(204).send("Password updated!");
};

export { resetPassword, updatePassword };
