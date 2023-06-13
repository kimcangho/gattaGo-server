import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.sendStatus(401);

  try {
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
  } catch {
    return res.sendStatus(403);
  }
 
  next();
};

export default authenticateToken;
