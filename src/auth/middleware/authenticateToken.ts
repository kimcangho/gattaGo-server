import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Not authorized!");
  const accessToken = authHeader.split(" ")[1];

  //  To-do: refactor token verification
  // try {
  //   verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
  // } catch {
  //   return res.status(403).send("Forbidden, invalid token!");
  // }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        console.log("Get new token!");

        verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

        return res.status(403).send("Forbidden, invalid token!");
      }

      next();
    }
  );
};

export default authenticateToken;
