import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();

//  Review API call to this route and add return statement
const findUser = async (email: string) => {
  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });
  if (foundEmail) throw new Error();
};

const createUser = async (email: string, password: string) => {
  await user.create({
    data: {
      email,
      password,
    },
  });
};

export { findUser, createUser };
