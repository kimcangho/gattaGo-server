import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Not authorized!");
  const accessToken = authHeader.split(" ")[1];

  console.log(req.headers["user"]);

  const emailHeader: any = req.headers["email"];
  console.log(emailHeader);

  const { refreshToken } = req.cookies;
  console.log(refreshToken);

  // const {accessToken} = req.body   //  Testing for reissuing refresh token

  //  To-do: refactor token verification
  // try {
  //   verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
  // } catch {
  //   return res.status(403).send("Forbidden, invalid token!");
  // }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
    async (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(403).send("Forbidden, invalid token!");
      }
      next();
    }
  );
};

export default authenticateToken;
