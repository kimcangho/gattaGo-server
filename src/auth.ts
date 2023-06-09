import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import loginRouter from "./routes/loginRoute";
// import tokenRouter from "./routes/tokenRoute";
// import logoutRouter from "./routes/logoutRoute";

dotenv.config();
const app: Express = express();
const PORT: number | string = process.env.AUTH_PORT || 7777;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

//  Routes
// app.use("/login", loginRouter);     //  creates access and refresh tokens
// app.use("/logout", logoutRouter)    //  deletes access and refresh tokens
// app.use("/token", tokenRouter);    //  creates access token with existing refresh token

app.listen(PORT, (): void => {
  console.log(`gattaGo auth server marshalling on PORT ${PORT}! 🪪`);
});
