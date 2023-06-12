import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (error: any) => {
    if (error) return res.sendStatus(403);
    next();
  });
};

export default authenticateToken;
