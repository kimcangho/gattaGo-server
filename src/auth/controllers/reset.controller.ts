import { Request, Response } from "express";
import {
  findUser,
  findResetCode,
  createResetCode,
  deleteResetCode,
  changePassword,
  findMatchingUserWithResetCode,
} from "../services/reset.services";
import { sendEmail } from "../utils/nodemailer.utils";
import { hashEntity } from "../utils/bcrypt.utils";

const getUserEmail = async (req: Request, res: Response) => {
  const { resetCodeId } = req.params;
  if (!resetCodeId) return res.status(400).send("No reset code sent!");

  try {
    const foundEmail = await findMatchingUserWithResetCode(resetCodeId);
    return res.status(200).send({ foundEmail });
  } catch (err) {
    return res.status(404).send("Invalid reset code!");
  }
};

const sendResetPasswordEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("No email field!");

  const foundUser = await findUser(email);
  if (!foundUser)
    return res
      .status(400)
      .send("Email does not exist! Cannot reset password...");

  try {
    const resetCode = await createResetCode(email);

    sendEmail(foundUser.email, "Password reset for", resetCode);
  } catch {
    return res.status(400).send("Cannot send reset code!");
  }

  res.status(200).send("Password reset code sent!");
};

const updatePassword = async (req: Request, res: Response) => {
  const { email, password, resetCode } = req.body;
  if (!email || !password || !resetCode)
    return res.status(400).send("Ensure all fields are inputted!");

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
    sendEmail(email, "Password successfully reset for");
  } catch {
    return res.status(400).send("Could not reset password!");
  } finally {
    deleteResetCode(email);
  }

  res.status(204).send("Password updated!");
};

export { sendResetPasswordEmail, updatePassword, getUserEmail };
