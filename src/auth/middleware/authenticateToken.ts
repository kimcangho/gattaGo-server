import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

interface tokenRequest extends Request {
  user: string | string[] | undefined;
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Not authorized!");
  const accessToken: string = authHeader.split(" ")[1];
  if (!accessToken) return res.status(401).send("Token not found!");

  const emailHeader: string | string[] | undefined = req.headers["email"];
  console.log('Email Header: ', emailHeader);

  const { refreshToken } = req.cookies;
  console.log('Refresh Token: ', refreshToken);

  try {
    // req.user = emailHeader; //  adds user to request object
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    next();
  } catch (err) {
    res.status(403).send("Invalid/expired access token")
  }
};

export default authenticateToken;
