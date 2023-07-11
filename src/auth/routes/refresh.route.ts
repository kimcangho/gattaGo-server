import { Router } from "express";
import { refreshToken } from "../controllers/refresh.controller";

const refreshRouter: Router = Router();

refreshRouter.route("/").get(refreshToken);

export default refreshRouter;
