import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const logoutRouter: Router = Router();

logoutRouter.route("/").delete(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { email } = req?.body;
  if (!email) return res.status(404).send("No email!");

  const foundHashedToken = await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
  if (!foundHashedToken) return res.status(404).send("Not found doe");

  const comparedTokens = await bcrypt.compare(
    refreshToken,
    foundHashedToken.id
  );
  if (!comparedTokens) {
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
});

export default logoutRouter;
