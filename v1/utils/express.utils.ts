import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "../routes";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import rateLimit from "express-rate-limit";
import { disconnectPostgres } from "../db/cleanup";
import { exit } from "process";
import logger from "../utils/logger";
import * as Errors from "../errors";
import { deserializeUser } from "../middleware/deserializeUser";
import { pinoHttp } from "pino-http";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 10 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    if (!req.ip) {
      return "unknown-ip";
    }
    return req.ip;
  },
});

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

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(limiter);
  app.use(deserializeUser);

  app.use(
    pinoHttp({
      logger,
      customSuccessMessage: (req, res, responsTime) => {
        return `${req.method} ${req.url} ${res.statusCode} FROM ${req.ip} - Elapsed time: ${responsTime} ms`;
      },
      customErrorMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode} FROM ${req.ip}`;
      },
    }),
  );

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
