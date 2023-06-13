import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const findRefreshToken = async (email: string) => {
  return await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
};

const deleteRefreshToken = async (id: string) => {
  await authRefreshToken.delete({
    where: {
      id,
    },
  });
};

export { findRefreshToken, deleteRefreshToken };
