import jwt from "jsonwebtoken";

const generateToken = async (
  email: string,
  secretKey: string,
  expirationInSec: number //  hardcoded to 30s
) => {
  return jwt.sign({ email }, secretKey, { expiresIn: `${expirationInSec}s` });
};

const verifyToken = (refreshToken: string, secretKey: string) => {
  return jwt.verify(refreshToken, secretKey!);
};

export { generateToken, verifyToken };
