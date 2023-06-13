import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import {
  deleteRefreshToken,
  findRefreshToken,
} from "../services/logout.services";

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const { email } = req.body;
  if (!email) return res.status(404).send("No email!");

  const foundHashedToken = await findRefreshToken(email);
  if (!foundHashedToken)
    return res.status(404).send("Refresh token not found!");

  if (!(await compareHash(refreshToken, foundHashedToken.id))) {
    return res.status(404).send("Not dis doe");
  }

  deleteRefreshToken(foundHashedToken.id);

  res.cookie("accessToken", {
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).send("Logged out!");
};

export { logoutUser };
