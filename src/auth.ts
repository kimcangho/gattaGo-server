import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import registerRouter from "./auth/routes/register.route";
import loginRouter from "./auth/routes/login.route";
import tokenRouter from "./auth/routes/token.route";
import logoutRouter from "./auth/routes/logout.route";
import resetRouter from "./auth/routes/reset.route";

import path from "path";

dotenv.config();
const app: Express = express();
const PORT: number | string = process.env.AUTH_PORT || 7777;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/token", tokenRouter);
app.use("/reset", resetRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send(`gattaGo auth server marshalling on PORT ${PORT}! 🪪`);
});

app.listen(PORT, (): void => {
  console.log(`gattaGo auth server marshalling on PORT ${PORT}! 🪪`);
});
