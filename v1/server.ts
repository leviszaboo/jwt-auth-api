import logger from "./utils/logger";
import {
  createServer,
  gracefulShutdown,
  shutdownSignals,
} from "./utils/express.utils";
import swaggerDocs from "./utils/swagger";
import { handleConnection } from "./db/connect";
import { Config } from "./utils/options";

const port = Config.PORT;

export async function startServer() {
  const app = createServer();

  const server = app.listen(port, () => {
    logger.info(`App is running on http://localhost:${port}`);
    logger.info(`Initializing PostgreSQL connection...`);

    handleConnection();

    swaggerDocs(app, port);
  });

  shutdownSignals.forEach((signal) => {
    process.on(signal, () => {
      gracefulShutdown(server, signal);
    });
  });
}

startServer();
