import logger from "../utils/logger";
import { prisma } from "./connect";

export async function disconnectPostgres() {
  await prisma.$disconnect();
  logger.info("PostgreSQL disconnected");
}
