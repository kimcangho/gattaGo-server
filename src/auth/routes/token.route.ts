import { Router, Request, Response } from "express";

const tokenRouter: Router = Router();

tokenRouter.route("/").post((req: Request, res: Response) => {
  //  Logic

  tokenRouter.route("/").post((req: Request, res: Response) => {
    //  get refresh token from header
    //  check for refresh token in DB
    //  verify refresh token through jwt
    //  generate access token and return access token
  });

  console.log("Token route");
  res.status(200).send();
});

export default tokenRouter;
