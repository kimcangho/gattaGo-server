import { Router } from "express";
import { resetPassword, updatePassword } from "../controllers/reset.controller";

const resetRouter: Router = Router();

resetRouter.route("/").get(resetPassword).put(updatePassword);

export default resetRouter;
