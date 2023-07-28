import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import {
  findUser,
  addRefreshToken,
  findPassword,
  updateRefreshToken,
} from "../services/login.services";
import jwt from "jsonwebtoken";
import { findRefreshToken } from "../services/login.services";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Invalid request!");

  //  Check for existing user refreshToken
  const isLoggedIn = await findRefreshToken(email);

  const foundUser = await findUser(email);
  if (!foundUser) return res.status(404).send("User not found!");
  if (foundUser?.email !== email)
    return res.status(404).send("Email not found!");

  const { id } = foundUser;
  const foundHashedPassword = await findPassword(email);
  if (!(await compareHash(password, foundHashedPassword)))
    return res.status(401).send("Password does not match!");

  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: `1d`,
  });

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `5s`,
  });

  if (isLoggedIn) await updateRefreshToken(refreshToken, email);
  else await addRefreshToken(refreshToken, email);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 6000000,
  });

  res.status(200).send({ accessToken, id });
};

export { loginUser };
