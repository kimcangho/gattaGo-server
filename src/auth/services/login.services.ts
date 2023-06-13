import { PrismaClient } from "@prisma/client";
const { user, authRefreshToken } = new PrismaClient();

const findRefreshToken = async (email: string) => {
  return await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
};

const findUser = async (email: string) => {
  const foundUser = await user.findUnique({
    where: {
      email,
    },
  });
  return foundUser?.email;
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

export {
  findRefreshToken,
  findUser,
  findPassword,
  deleteRefreshToken,
  addRefreshToken,
};
