import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticate from "../middleware/authenticate";
import routes from "../routes";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import { disconnectPostgres } from "../db/cleanup";
import { exit } from "process";
import logger from "../utils/logger";
import * as Errors from "../errors";

export const shutdownSignals: NodeJS.Signals[] = [
  "SIGINT",
  "SIGTERM",
  "SIGHUP",
];

const errorClasses = Object.values(Errors);

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (errorClasses.some((errorClass) => err instanceof errorClass)) {
    const { name, errorCode, message } = err;

    res.status(err.statusCode).send({
      error: {
        name,
        errorCode,
        message,
      },
    });

    return;
  }

  res.status(500).send({
    error: {
      message: "An unexpected error occurred. Please try again later.",
    },
  });
};

export const createServer = () => {
  const app = express();

  app.enable("trust proxy");

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(authenticate);

  routes(app);

  app.use(errorHandler);

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
