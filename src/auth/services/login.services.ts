import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

const findUser = async (email: string) => {
  const foundUser = await user.findUnique({
    where: {
      email,
    },
  });
  return foundUser;
};

const findPassword = async (email: string) => {
  const foundUser = await user.findUnique({
    where: {
      email,
    },
  });
  return foundUser!.password;
};

export { findUser, findPassword };
