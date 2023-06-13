import { PrismaClient } from "@prisma/client";
const { user, authRefreshToken } = new PrismaClient();

const findUser = async (email: string) => {
  return await user.findUnique({
    where: {
      email,
    },
  });
};

const findPassword = async (email: string) => {
  const foundUser = await user.findUnique({
    where: {
      email,
    },
  });
  return foundUser!.password;
};

const deleteRefreshToken = async (email: string) => {
  await authRefreshToken.deleteMany({
    where: {
      email,
    },
  });
};

const addRefreshToken = async (id: string, email: string) => {
  await authRefreshToken.create({
    data: {
      id,
      email,
    },
  });
};

export { findUser, findPassword, deleteRefreshToken, addRefreshToken };
