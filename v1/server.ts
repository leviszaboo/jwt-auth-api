import config from "config";
import routes from "./routes";
import logger from "./utils/logger";
import createServer from "./utils/createServer";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import closeConnection from "./db/cleanup";
import swaggerDocs from "./utils/swagger";
import { exit } from "process";

const port = config.get<number>("port");

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGHUP"];

function gracefulShutdown(
  server: Server,
  signal: (typeof shutdownSignals)[number],
) {
  const shutdownManager = new GracefulShutdownManager(server);
  logger.info(`Received ${signal}. Starting graceful shutdown.`);
  closeConnection();
  shutdownManager.terminate(() => {
    logger.info("Server is gracefully terminated");
    exit(0);
  });
}

async function startServer() {
  const app = createServer();

  const server = app.listen(port, () => {
    logger.info(`App is running on http://localhost:${port}`);
    logger.info(`Initializing MySQL connection...`);

    swaggerDocs(app, port);

    routes(app);
  });

  shutdownSignals.forEach((signal) => {
    process.on(signal, () => {
      gracefulShutdown(server, signal);
    });
  });
}

startServer();
