import { Router } from "express";
import { registerUser } from "../controllers/register.controller";

const registerRouter: Router = Router();

registerRouter.route("/").post(registerUser);

export default registerRouter;
