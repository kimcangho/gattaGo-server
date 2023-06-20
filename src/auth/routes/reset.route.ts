import { Router } from "express";
import { resetPassword, updatePassword } from "../controllers/reset.controller";

const resetRouter: Router = Router();

resetRouter
  .route("/")
  .get(resetPassword) //  get reset password
  .put(updatePassword); //  update new password

export default resetRouter;
