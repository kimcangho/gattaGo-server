import { Request, Response } from "express";
import {
  findUser,
  findResetCode,
  createResetCode,
  deleteResetCode,
  changePassword,
} from "../services/reset.services";
import { sendEmail } from "../utils/nodemailer.utils";
import { hashEntity } from "../utils/bcrypt.utils";

interface MailOptions {
  from: String;
  to: String;
  subject: String;
  text: String;
}

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("No email field!");

  //    Check for email
  try {
    await findUser(email);
  } catch {
    return res
      .status(400)
      .send("Email does not exist! Cannot reset password...");
  }

  //    Create new record in passwordReset schema containing resetCode and expiry date

  try {
    const resetCode = await createResetCode(email);
    sendEmail(
      email,
      "Password reset for",
      "Looks like you want to reset your password. Click on the link below! Your link will expire within 10 minutes!",
      `<a href="http://localhost:5173/reset_password"><b>Reset Password Here: http://localhost:5173/reset_password/${resetCode}</b></a>`
    );
  } catch {
    console.log("Can't send reset code!");
  }

  res.status(200).send("Password reset code sent!");
};

const updatePassword = async (req: Request, res: Response) => {
  const { email, password, resetCode } = req.body;

  try {
    await findUser(email);
  } catch {
    return res
      .status(400)
      .send("Email does not exist! Cannot reset password...");
  }

  try {
    await findResetCode(resetCode);

    const hashedPassword: string = await hashEntity(password);
    await changePassword(email, hashedPassword);

    sendEmail(
      email,
      "Password successfully reset for",
      "Your password has been successfully reset!",
      '<p>Password successfully reset! <a href="http://localhost:5173/login"><b>Login Here</b></a></p>'
    );
  } catch {
    return res.status(400).send("Could not reset password!");
  } finally {
    deleteResetCode(email);
  }

  res.status(204).send("Password updated!");
};

export { resetPassword, updatePassword };
