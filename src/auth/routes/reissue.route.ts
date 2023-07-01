import { Router } from "express";
import { reissueAccessToken } from "../controllers/reissue.controller";

const reissueRouter: Router = Router();

reissueRouter.route("/").post(reissueAccessToken);

export default reissueRouter;
