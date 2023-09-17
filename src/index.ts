import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import registerRouter from "./auth/routes/register.route";
import loginRouter from "./auth/routes/login.route";
import logoutRouter from "./auth/routes/logout.route";
import resetRouter from "./auth/routes/reset.route";
import refreshRouter from "./auth/routes/refresh.route";

import authenticateToken from "./auth/middleware/authenticateToken";
import team from "./api/routes/team.route";
import athlete from "./api/routes/athlete.route";

dotenv.config();
const app: Express = express();
const PORT: number | string = process.env.PORT! || 8888;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://gattaGo.netlify.app"],
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send(`Paddles up! gattaGo server is taking it away on PORT ${PORT}! 🚣🏼`);
});

app.use("/register", registerRouter); //  register user
app.use("/login", loginRouter); //  login user
app.use("/logout", logoutRouter); //  logout user
app.use("/reset", resetRouter); //  reset password
app.use("/refresh", refreshRouter); //  refresh access token

// app.use(authenticateToken);
app.use("/teams", team); //    team resource
app.use("/athletes", athlete); //    athlete resource

app.listen(PORT, () => {
  console.log(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});
