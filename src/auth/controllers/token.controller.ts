import { Request, Response } from "express";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import { compareHash } from "../utils/bcrypt.utils";
import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const issueToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { email } = req.body;
  if (!refreshToken) return res.status(404).send("No refresh token found!");

  const foundHashedToken = await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
  if (!foundHashedToken)
    return res.status(404).send("No refresh token found in DB!");

  if (!(await compareHash(refreshToken, foundHashedToken!.id)))
    return res.status(401).send("Tokens do not match!");

  try {
    verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(401).send("Catch error on JWT verify");
  }

  const accessToken = await generateToken(
    email,
    process.env.ACCESS_TOKEN_SECRET!,
    30
  );

  res.cookie("accessToken", accessToken, {
    maxAge: 600000,
    httpOnly: true,
  });

  res.status(200).send("Successful access token request!");
};

export { issueToken };
