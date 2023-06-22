import { Router } from "express";
import {
  getUserEmail,
  resetPassword,
  updatePassword,
} from "../controllers/reset.controller";

const resetRouter: Router = Router();

resetRouter.route("/").post(resetPassword).put(updatePassword);

resetRouter.route("/:resetCodeId").get(getUserEmail);

export default resetRouter;
