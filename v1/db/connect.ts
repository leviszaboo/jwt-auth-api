import { prisma } from "./prisma";
import logger from "../utils/logger";

export async function handleConnection(elapsedTime: number = 0): Promise<void> {
  const maxTime = 120000;

  if (elapsedTime >= maxTime) {
    logger.error(
      `Failed to connect to PostgreSQL after ${maxTime / 1000} seconds. Exiting...`,
    );
    process.exit(1);
  }

  try {
    await prisma.$connect();
    logger.info(
      `Successfully connected to PostgreSQL!\nElapsed time: ${elapsedTime / 1000} seconds`,
    );
  } catch (err: any) {
    if (err.errorCode === "P1001") {
      setTimeout(() => handleConnection(elapsedTime + 100), 100);
    } else {
      logger.error("Error connecting to PostgreSQL: ");
      logger.error(err);
      logger.info("Retrying PostgreSQL connection 5 seconds...");
      setTimeout(() => handleConnection(elapsedTime + 5000), 5000);
    }
  }
}
