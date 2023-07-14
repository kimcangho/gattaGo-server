import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import {
  findUser,
  addRefreshToken,
  findPassword,
} from "../services/login.services";
import jwt from "jsonwebtoken";
import { findRefreshToken } from "../services/login.services";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Invalid request!");

  const isLoggedIn = await findRefreshToken(email);
  if (isLoggedIn) return res.status(400).send("Already logged in!");

  const foundEmail = await findUser(email);
  if (foundEmail !== email) return res.status(404).send("Email not found!");

  const foundHashedPassword = await findPassword(email);
  if (!(await compareHash(password, foundHashedPassword)))
    return res.status(401).send("Password does not match!");

  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: `1d`,
  });

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `5s`,
  });

  await addRefreshToken(refreshToken, email);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 6000000,
  });

  res.status(200).send({ accessToken });
};

export { loginUser };
