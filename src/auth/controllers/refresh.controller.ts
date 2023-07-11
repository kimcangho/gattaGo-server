import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { user } = new PrismaClient();
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const refreshToken = async (req: Request, res: Response) => {
  console.log("testing");
  const { refreshToken, email } = req.cookies;
  console.log(refreshToken);

  //    Check refresh token and user
  if (!refreshToken || !email)
    return res.status(401).send("No refresh token nor email!");

  console.log("finding user...");
  const foundUser = await user.findUnique({ where: { email } });
  if (!foundUser) return res.sendStatus(403);

  console.log("verifying...");
  //    evaluate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: JsonWebTokenError | null, decoded: any) => {
      if (err) return res.status(403).send("Verification error");
      console.log(decoded);
      const accessToken = jwt.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "30s" }
      );
      console.log(accessToken);
      res.json({ accessToken });
    }
  );

  //   return res.status(200).send({ refreshToken, email });
};

export { refreshToken };
