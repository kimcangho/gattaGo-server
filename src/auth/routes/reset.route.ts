import { Router } from "express";
import {
  getUserEmail,
  sendResetPasswordEmail,
  updatePassword,
} from "../controllers/reset.controller";

const resetRouter: Router = Router();

resetRouter.route("/").post(sendResetPasswordEmail).put(updatePassword);

resetRouter.route("/:resetCodeId").get(getUserEmail);

export default resetRouter;
