import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
})

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGINS,
        credentials: true,
    })
);

app.get("/",(req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "health  ok",
    })
});

export default app;