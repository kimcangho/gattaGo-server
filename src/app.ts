import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import regatta from "./api/routes/regatta.route";
import team from "./api/routes/team.route";
import athlete from "./api/routes/athlete.route";

dotenv.config();
const app: Express = express();
const PORT: string = process.env.PORT! || "8888";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/regattas", regatta);
app.use("/teams", team);
app.use("/athletes", athlete);

app.get("/", (_req: Request, res: Response) => {
  res.send(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});

app.listen(PORT, () => {
  console.log(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});
