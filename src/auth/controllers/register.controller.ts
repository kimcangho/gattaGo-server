import { Request, Response } from "express";
import bcrypt from "bcrypt";
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

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(200).send(`Successfully registered user with email ${email}!`);
};

export { registerUser };
