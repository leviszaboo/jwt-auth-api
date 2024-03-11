import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticate from "../middleware/authenticate";
import routes from "../routes";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import { disconnectPostgres } from "../db/cleanup";
import { exit } from "process";
import logger from "../utils/logger";

export const shutdownSignals: NodeJS.Signals[] = [
  "SIGINT",
  "SIGTERM",
  "SIGHUP",
];

export const createServer = () => {
  const app = express();

  app.enable("trust proxy");

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(authenticate);

  routes(app);

  return app;
};

export const gracefulShutdown = (
  server: Server,
  signal: (typeof shutdownSignals)[number],
) => {
  const shutdownManager = new GracefulShutdownManager(server);
  logger.info(`Received ${signal}. Starting graceful shutdown.`);
  disconnectPostgres();
  shutdownManager.terminate(() => {
    logger.info("Server is gracefully terminated");
    exit(0);
  });
};
