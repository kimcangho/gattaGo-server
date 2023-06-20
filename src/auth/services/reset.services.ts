import { PrismaClient } from "@prisma/client";
const { user, passwordReset } = new PrismaClient();

const findUser = async (email: string) => {
  const foundEmail = await user.findUnique({
    where: {
      email,
    },
  });
  if (!foundEmail) throw new Error();
};

const createResetCode = async (email: string) => {
  const expirationTimeInMS: number = 10 * 60 * 1000;

  await passwordReset.create({
    data: {
      email,
      expiresAt: new Date(Date.now() + expirationTimeInMS),
    },
  });

  const resetCode = await passwordReset.findUnique({
    where: {
      email,
    },
  });

  return resetCode!.id;
};

const findResetCode = async (resetCode: string) => {
  const foundCode = await passwordReset.findUnique({
    where: {
      id: resetCode,
    },
  });

  if (!foundCode) throw new Error();
  if (Date.now() > foundCode!.expiresAt.getTime()) throw new Error();
};

const changePassword = async (email: string, password: any) => {
  await user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  });
};

const deleteResetCode = async (email: string) => {
  await passwordReset.delete({
    where: {
      email,
    },
  });
};

export {
  findUser,
  createResetCode,
  findResetCode,
  changePassword,
  deleteResetCode,
};
