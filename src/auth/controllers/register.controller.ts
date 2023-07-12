import { Request, Response } from "express";
import { hashEntity } from "../utils/bcrypt.utils";
import { findUser, createUser } from "../services/register.services";

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    await findUser(email);
  } catch {
    return res.status(400).send("Email exists! Cannot register bro");
  }

  const hashedPassword = await hashEntity(password);
  await createUser(email, hashedPassword);
  res.status(200).send(`Successfully registered user with email ${email}!`);
};

export { registerUser };
