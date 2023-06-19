import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import {
  deleteRefreshToken,
  findRefreshToken,
} from "../services/logout.services";

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(404).send("No refresh token found!");

  const { email } = req.body;
  if (!email) return res.status(404).send("No email!");

  const foundHashedToken = await findRefreshToken(email);
  if (!foundHashedToken) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true }); //  in production on https, add 'secure: true'
    return res.status(204).send("Refresh token not found!");
  }

  if (!(await compareHash(refreshToken, foundHashedToken.id))) {
    return res.status(404).send("Not dis doe");
  }

  deleteRefreshToken(foundHashedToken.id);

  //  Reminder: delete access token in memory on client side
  res.clearCookie("refreshToken", { httpOnly: true, secure: true }); //  in production on https, add 'secure: true'
  res.status(204).send("Logged out!");
};

export { logoutUser };
