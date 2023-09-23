import { PrismaClient } from "@prisma/client";
const { user, 
  // authRefreshToken 
} = new PrismaClient();

// const findRefreshToken = async (email: string) => {
//   const foundToken = await authRefreshToken.findUnique({
//     where: {
//       email,
//     },
//   });
//   return foundToken;
// };

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

export {
  findUser,
  findPassword,
};
