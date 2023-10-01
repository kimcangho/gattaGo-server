import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import registerRouter from "./auth/routes/register.route";
import loginRouter from "./auth/routes/login.route";
import resetRouter from "./auth/routes/reset.route";

import authenticateToken from "./auth/middleware/authenticateToken";
import team from "./api/routes/team.route";
import athlete from "./api/routes/athlete.route";

dotenv.config();
const app: Express = express();
const PORT: number | string = process.env.PORT! || 8888;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({ origin: ["http://localhost:5173", "https://gatta-go-client-1akchmkoc-kimcangho.vercel.app/"] })
);

app.get("/", (_req: Request, res: Response) => {
  res.send(`Paddles up! gattaGo server is taking it away on PORT ${PORT}! 🚣🏼`);
});

app.use("/register", registerRouter); //  register user to database
app.use("/login", loginRouter); //  login user and issue access token
app.use("/reset", resetRouter); //  reset user password by email

app.use(authenticateToken);
app.use("/teams", team);
app.use("/athletes", athlete);

app.listen(PORT, () => {
  console.log(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});
