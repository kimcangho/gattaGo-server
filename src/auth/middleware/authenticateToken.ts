import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  //  To-do: refactor to verify access token through authorization header
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Not authorized!");

  const accessToken = authHeader.split(" ")[1];
  console.log(accessToken);
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
      if (err) return res.status(403).send("Forbidden, invalid token!");
      // req.email = user.email;    //  To-do: look into setting user
      next();
    }
  );
};

export default authenticateToken;
