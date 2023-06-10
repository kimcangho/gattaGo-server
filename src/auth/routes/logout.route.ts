import { Router, Request, Response } from "express";

const loginRouter: Router = Router();

loginRouter.route("/").delete((req: Request, res: Response) => {
  //  Logic
  console.log("Logout route")

  //  Delete refresh token from DB

  res.status(200).send()
});

export default loginRouter;
