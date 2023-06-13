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

const verifyToken = (refreshToken: string) => {
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
};

export { generateToken, verifyToken };
