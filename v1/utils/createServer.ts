import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticate from "../middleware/authenticate";

export default function createServer() {
  const app = express();

  app.enable("trust proxy");

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(authenticate);

  return app;
}
