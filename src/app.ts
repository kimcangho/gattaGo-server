import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT: string = process.env.PORT! || "8888";

app.get("/", (_req: Request, res: Response) => {
  res.send(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});

app.get("/api/regattas", (req: Request, res: Response) => {
  console.log('get regattas')
  res.send('regattas here')
})

app.listen(PORT, () => {
  console.log(`Paddles up! gattaGo is taking it away on PORT ${PORT}! 🚣🏼`);
});
