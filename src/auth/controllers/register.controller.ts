import { Request, Response } from "express";
import { hashEntity} from "../utils/bcrypt.utils";
import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });
  if (foundEmail)
    return res.status(400).send("Email exists! Cannot register doe");

  const hashedPassword = await hashEntity(password);

  await user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(200).send(`Successfully registered user with email ${email}!`);
};

export { registerUser };
