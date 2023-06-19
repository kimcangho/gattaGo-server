import { Router } from "express";
import { resetPassword } from "../controllers/reset.controller";

const resetRouter: Router = Router();

resetRouter.route("/").get(resetPassword);

export default resetRouter;
