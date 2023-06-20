import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

const findUser = async (email: string) => {
  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });
  if (!foundEmail) throw new Error();
};

export { findUser };
