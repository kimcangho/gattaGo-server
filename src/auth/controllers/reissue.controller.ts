import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.utils";

import jwt from "jsonwebtoken";

const reissueAccessToken = async (req: Request, res: Response) => {
  const { refreshToken, email } = req.cookies;
  // const { email } = req.body;
  console.log(`Refresh Token: ${refreshToken}`);
  console.log(`Email: ${email}`);
  if (!refreshToken) return res.status(404).send("No Token!");

  try {
    const resultToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    console.log("Result: ", resultToken);

    const accessToken = await generateToken(
      email,
      process.env.ACCESS_TOKEN_SECRET!,
      30
    );

    console.log("Sending access token boiiiiii!", accessToken);
    res.status(200).send({accessToken});

    // ,
    // (
    //   err: jwt.VerifyErrors | null,
    //   decoded: string | jwt.JwtPayload | undefined
    // ) => {
    //   if (err) {
    //     return res.status(406).send("Wrong refresh token!");
    //   } else {

    //     //Verify Refresh Token
    //     //  If wrong token, send error message - 406 unauthorized
    //     //  Else sign new access token and send
    //     //  accessToken = jwt.sign(email, access_secret_key, {expiresIn: '5m'})
    //     //  return res.json({accessToken})
    //     const testReissue = async (
    //       email: string,
    //       secret: string,
    //       time: number
    //     ) => {
    //       const accessToken = await generateToken(email, secret, time);
    //       console.log("Sending access token boiiiiii!");
    //       res.status(200).send(accessToken);
    //     };

    //     const accessToken = testReissue(
    //       email,
    //       process.env.ACCESS_TOKEN_SECRET!,
    //       30
    //     );
    // }
    // }
    // );
  } catch (err) {
    console.log("Result...", err);
  }
};

export { reissueAccessToken };
