import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt, { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";
const { user, authRefreshToken } = new PrismaClient();

dotenv.config();

const logoutRouter: Router = Router();

logoutRouter.route("/").post(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //   Check for email against database records
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

  const comparedHash = await bcrypt.compare(
    password,
    foundHashedPassword!.password
  );
  console.log(comparedHash);
  if (!comparedHash) return res.status(404).send("No match!");

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

  //    Hash Refresh Token String
  const saltRounds = 10;
  const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

  //    To-do: add refresh token to DB
  await authRefreshToken.create({
    data: {
      id: hashedRefreshToken,
    },
  });
  res.status(200).send({ accessToken, refreshToken });
});

export default logoutRouter;
