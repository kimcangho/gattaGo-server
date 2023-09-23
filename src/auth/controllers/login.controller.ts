import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import { findUser, findPassword } from "../services/login.services";
import jwt from "jsonwebtoken";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Invalid request!");

  const foundUser = await findUser(email);
  if (!foundUser) return res.status(404).send("User not found!");
  if (foundUser?.email !== email)
    return res.status(404).send("Email not found!");

  const { id } = foundUser;
  const foundHashedPassword = await findPassword(email);
  if (!(await compareHash(password, foundHashedPassword)))
    return res.status(401).send("Password does not match!");

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `20m`,
  });

  res.status(200).send({ accessToken, id });
};

export { loginUser };
