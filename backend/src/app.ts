import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.route.js";
import orgRouter from "./modules/organization/organization.route.js";
import serviceRouter from "./modules/service/service.route.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "health  ok",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", orgRouter);
app.use("/api/v1/service", serviceRouter);

app.use(errorHandler);

export default app;
