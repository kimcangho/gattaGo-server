// import { Request, Response } from "express";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
// import { findUser } from "../services/refresh.services";

// const refreshToken = async (req: Request, res: Response) => {
//   const { refreshToken } = req.cookies;
//   if (!refreshToken) return res.status(401).send("No refresh token nor email!");

//   const foundUser = await findUser(refreshToken)!;
//   if (!foundUser) return res.sendStatus(403);

//   try {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET!,
//       (err: JsonWebTokenError | null, decoded: any) => {
//         if (err) return res.status(403).send("Verification error");
//         const accessToken = jwt.sign(
//           { email: decoded.email },
//           process.env.ACCESS_TOKEN_SECRET!,
//           { expiresIn: "5s" }
//         );
//         res.status(200).send({ accessToken });
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

// export { refreshToken };
