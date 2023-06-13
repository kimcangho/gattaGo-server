import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { compareHash, hashEntity } from "../utils/bcrypt.utils";
const { user, authRefreshToken } = new PrismaClient();

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("Invalid request!");

  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });
  if (foundEmail!.email !== email) return res.status(404).send("Error!");

  const foundHashedPassword = await user.findUnique({
    where: {
      email,
    },
  });

  if (!(await compareHash(password, foundHashedPassword!.password)))
    return res.status(401).send("Password does not match!");

  const accessToken: string | jwt.JwtPayload = jwt.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "30s",
    }
  );

  const refreshToken: string | jwt.JwtPayload = jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET!
  );

  await authRefreshToken.deleteMany({
    where: {
      email,
    },
  });

  const hashedRefreshToken = await hashEntity(refreshToken);

  await authRefreshToken.create({
    data: {
      id: hashedRefreshToken,
      email,
    },
  });

  res.cookie("accessToken", accessToken, {
    maxAge: 600000,
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 6000000,
    httpOnly: true,
  });

  res.status(200).send("Login successful!");
};

export { loginUser };
