import { PrismaClient } from "@prisma/client";
const { authRefreshToken } = new PrismaClient();

const findRefreshToken = async (email: any) => {
  try {
    return await authRefreshToken.findUnique({
      where: {
        email,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export { findRefreshToken };
