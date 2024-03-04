import logger from "../utils/logger";
import { prisma } from "./prisma";

export async function disconnectPostgres() {
  await prisma.$disconnect();
  logger.info("PostgreSQL disconnected");
}
