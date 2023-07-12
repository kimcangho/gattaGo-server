import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const findUser = async (id: string) => {
  return await authRefreshToken.findUnique({
    where: { id },
  });
};

export { findUser };
