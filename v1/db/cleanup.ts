import logger from "../utils/logger";
import pool from "./connect";

export default function closeConnection() {
  pool.end();
  logger.info(`MySQL connection closed.`);
}
