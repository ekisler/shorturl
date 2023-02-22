import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

// Solo para ejemplo de Login y Token
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀🚀🚀🚀🚀🚀🚀 http://localhost:" + PORT));
