import { Request, Response } from "express";
import { compareHash, hashEntity } from "../utils/bcrypt.utils";
import { generateToken } from "../utils/jwt.utils";
import {
  findUser,
  deleteRefreshToken,
  addRefreshToken,
  findPassword,
} from "../services/login.services";
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

  const accessToken = await generateToken(
    email,
    process.env.ACCESS_TOKEN_SECRET!,
    10
  );

  const refreshToken = await generateToken(
    email,
    process.env.REFRESH_TOKEN_SECRET!
  );

  console.log(refreshToken)
  
  await deleteRefreshToken(email);
  const hashedRefreshToken = await hashEntity(refreshToken);
  await addRefreshToken(hashedRefreshToken, email);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 6000000,
  });

  res.cookie("email", email, {
    httpOnly: true,
    maxAge: 6000000,
  });

  res.status(200).send({ accessToken });
};

export { loginUser };
