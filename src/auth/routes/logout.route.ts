import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const logoutRouter: Router = Router();

logoutRouter.route("/").delete(async (req: Request, res: Response) => {
  const { email, refreshToken } = req.body;

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

  res.status(200).send("Logged out!");
});

export default logoutRouter;
