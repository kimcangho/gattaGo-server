import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  //  Get token from HTTP request header
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (error, user) => {
    if (error) return res.sendStatus(403);
    // req.body.user = user;
    next();
  });
};

export default authenticateToken;
