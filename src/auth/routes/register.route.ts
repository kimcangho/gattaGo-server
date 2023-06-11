import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

const registerRouter: Router = Router();

registerRouter.route("/").post(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });

  if (foundEmail)
    return res.status(400).send("Email exists! Cannot register doe");

  await user.create({
    data: {
      email,
      password,
    },
  });

  res.status(200).send("Successfully registered user!");
});

export default registerRouter;
