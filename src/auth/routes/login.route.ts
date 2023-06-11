import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const logoutRouter: Router = Router();

logoutRouter.route("/").post(async (req: Request, res: Response) => {
  //  User sends credentials including email and password
  const { email, password } = req.body;

  //  To-do: Check for email against database records
  
  //  To-do: Check for hashed password against database records

  //    Create access token
  const accessToken: string | jwt.JwtPayload = jwt.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "30s",
    }
  );
  //    create refresh token
  const refreshToken: string | jwt.JwtPayload = jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET!
  );

  //    To-do: add refresh token to DB

  res.status(200).send({ accessToken, refreshToken });
});

export default logoutRouter;
