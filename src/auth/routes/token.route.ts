import { Router } from "express";
import { issueToken } from "../controllers/token.controller";

const tokenRouter: Router = Router();

tokenRouter.route("/").post(issueToken);

export default tokenRouter;
