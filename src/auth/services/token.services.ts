import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const findRefreshToken = async (email: string) => {
  return await authRefreshToken.findUnique({
    where: {
      email,
    },
  });
};

export { findRefreshToken };
