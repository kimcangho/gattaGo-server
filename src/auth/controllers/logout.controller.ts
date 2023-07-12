import { Request, Response } from "express";
import {
  deleteRefreshToken,
  findRefreshToken,
} from "../services/logout.services";

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(404).send("Input fields must be filled!");

  const foundToken = await findRefreshToken(refreshToken);
  if (!foundToken) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(204).send("Refresh token not found!");
  }

  deleteRefreshToken(foundToken.id);
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.status(204).send("Logged out!");
};

export { logoutUser };
