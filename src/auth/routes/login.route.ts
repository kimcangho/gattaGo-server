import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const { user, authRefreshToken } = new PrismaClient();

dotenv.config();

const loginRouter: Router = Router();

loginRouter.route("/").post(async (req: Request, res: Response) => {
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
  console.log(foundHashedPassword);
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

  await authRefreshToken.deleteMany({
    where: {
      email,
    },
  });

  const saltRounds = 10;
  const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

  await authRefreshToken.create({
    data: {
      id: hashedRefreshToken,
      email,
    },
  });
  res.status(200).send({ accessToken, refreshToken });
});

export default loginRouter;
