import jwt from "jsonwebtoken";

const generateToken = async (
  email: string,
  secretKey: string,
  expirationInSec?: number
) => {
  return jwt.sign(
    { email },
    secretKey,
    expirationInSec
      ? {
          expiresIn: `${expirationInSec}s`,
        }
      : undefined
  );
};

const verifyToken = (refreshToken: string, secretKey: string) => {
  return jwt.verify(refreshToken, secretKey!);
};

export { generateToken, verifyToken };
