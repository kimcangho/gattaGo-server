import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const findRefreshToken = async (id: string) => {
  return await authRefreshToken.findUnique({
    where: {
      id,
    },
  });
};

const deleteRefreshToken = async (id: string) => {
  try {
    await authRefreshToken.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export { findRefreshToken, deleteRefreshToken };
