import express, { Express } from "express";
import * as dotenv from "dotenv";
// import loginRouter from "./routes/loginRoute";
// import tokenRouter from "./routes/tokenRoute";
// import logoutRouter from "./routes/logoutRoute";

dotenv.config();
const app: Express = express();
const PORT: number | string = process.env.AUTH_PORT || 7777;

//  Middleware
app.use(express.json());
// app.use(cors());
// app.use(cookieParser())

//  Routes
// app.use("/login", loginRouter);     //  creates access and refresh tokens
// app.use("/logout", logoutRouter)    //  deletes access and refresh tokens
// app.use("/token", tokenRouter);    //  creates access token with existing refresh token

app.listen(PORT, (): void => {
  console.log(`gattaGo auth server marshalling on PORT ${PORT}! 🪪`);
});
