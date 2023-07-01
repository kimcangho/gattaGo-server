import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.utils";

import jwt from "jsonwebtoken";

const reissueAccessToken = (req: Request, res: Response) => {
  // const { refreshToken } = req.cookies;
  const { refreshToken, email } = req.body;
  console.log(`Refresh Token: ${refreshToken}`);
  if (!refreshToken) return res.status(404).send("No Token!");

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) {
          return res.status(406).send("Wrong refresh token!");
        } else {

          //Verify Refresh Token
          //  If wrong token, send error message - 406 unauthorized
          //  Else sign new access token and send
          //  accessToken = jwt.sign(email, access_secret_key, {expiresIn: '5m'})
          //  return res.json({accessToken})
          const testReissue = async (
            email: string,
            secret: string,
            time: number
          ) => {
            const accessToken = await generateToken(email, secret, time);
            console.log("Sending access token boiiiiii!");
            res.status(200).send(accessToken);
          };

          const accessToken = testReissue(
            email,
            process.env.ACCESS_TOKEN_SECRET!,
            30
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }

};

export { reissueAccessToken };
