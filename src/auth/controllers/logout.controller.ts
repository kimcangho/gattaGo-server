import { Request, Response } from "express";
import { compareHash } from "../utils/bcrypt.utils";
import {
  deleteRefreshToken,
  findRefreshToken,
} from "../services/logout.services";

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken, email } = req.cookies;
  if (!refreshToken || !email)
    return res.status(404).send("Input fields must be filled!");

  const foundHashedToken = await findRefreshToken(email);
  if (!foundHashedToken) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(204).send("Refresh token not found!");
  }

  if (!(await compareHash(refreshToken, foundHashedToken.id))) {
    return res.status(404).send("Not dis doe");
  }

  deleteRefreshToken(foundHashedToken.id);

  //  Reminder: delete access token in memory on client side
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.clearCookie("email", { httpOnly: true, secure: true });
  res.status(204).send("Logged out!");
};

export { logoutUser };
