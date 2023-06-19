import { Request, Response } from "express";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import jwt from "jsonwebtoken";
import { compareHash } from "../utils/bcrypt.utils";
import { findRefreshToken } from "../services/token.services";

const issueToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(404).send("No refresh token found!");

  const { email } = req.body;
  const foundHashedToken = await findRefreshToken(email);
  if (!foundHashedToken)
    return res.status(401).send("No refresh token found in DB!");

  if (!(await compareHash(refreshToken, foundHashedToken!.id)))
    return res.status(401).send("Tokens do not match!");

  //  To-do: refactor jwt verification functions

  // try {
  //   verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  // } catch (err) {
  //   return res.status(401).send("Catch error on JWT verify");
  // }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) return res.status(403).send("Cannot verify token!");
      // const accessToekn = jwt.sign(
      //   { email: decoded!.email },
      //   process.env.ACCESS_TOKEN_SECRET!,
      //   { expiresIn: "30s" }
      // );
    }
  );

  const accessToken = await generateToken(
    email,
    process.env.ACCESS_TOKEN_SECRET!,
    30
  );

  res.status(200).send({ accessToken });
};

export { issueToken };
