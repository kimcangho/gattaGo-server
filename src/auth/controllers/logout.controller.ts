import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { email } = req?.body;
  if (!email) return res.status(404).send("No email!");

  const foundHashedToken = await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
  if (!foundHashedToken) return res.status(404).send("Not found doe");

  if (!(await compareHash(refreshToken, foundHashedToken.id))) {
    return res.status(404).send("Not dis doe");
  }

  await authRefreshToken.delete({
    where: {
      id: foundHashedToken.id,
    },
  });

  res.cookie("accessToken", {
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).send("Logged out!");
};

export { logoutUser };
