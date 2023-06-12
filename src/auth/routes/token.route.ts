import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

dotenv.config();

const tokenRouter: Router = Router();

tokenRouter.route("/").post(async (req: Request, res: Response) => {
  const { email, refreshToken } = req.body;
  if (!refreshToken) return res.status(404).send("No refresh token found!");

  const foundHashedToken = await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
  if (!foundHashedToken)
    return res.status(404).send("No refresh token found in DB!");

  const comparedTokens = await bcrypt.compare(
    refreshToken,
    foundHashedToken!.id
  );
  if (!comparedTokens) return res.status(404).send("Tokens do not match!");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, () => {
    const accessToken: string | jwt.JwtPayload = jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "30s",
      }
    );
    res.status(200).send({ accessToken });
  });
});

export default tokenRouter;
