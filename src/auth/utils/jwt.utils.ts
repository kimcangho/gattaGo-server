import jwt from "jsonwebtoken";

const verifyToken = (refreshToken: string, secretKey: string) => {
  return jwt.verify(refreshToken, secretKey!);
};

export { verifyToken };