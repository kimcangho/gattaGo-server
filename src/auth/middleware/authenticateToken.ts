import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Not authorized!");
  const accessToken: string = authHeader.split(" ")[1];
  if (!accessToken) return res.status(401).send("Token not found!");

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    next();
  } catch (err) {
    res.status(403).send("Invalid/expired access token");
  }
};

export default authenticateToken;
