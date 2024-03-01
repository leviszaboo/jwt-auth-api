import mysql from "mysql2";
import config from "config";
import logger from "../utils/logger";

const pool = mysql
  .createPool({
    host: config.get<string>("db.dbHost"),
    user: config.get<string>("db.dbUser"),
    password: config.get<string>("db.dbPassword"),
    database: config.get<string>("db.dbName"),
  })
  .promise();

async function handleConnection(elapsedTime: number = 0) {
  const maxTime = 120000;

  if (elapsedTime >= maxTime) {
    logger.error(
      `Failed to connect to MySQL after ${maxTime / 1000} seconds. Exiting...`,
    );
    process.exit(1);
  }

  try {
    await pool.getConnection();
    logger.info(
      `Successfully connected to MySQL!\nElapsed time: ${elapsedTime / 1000} seconds`,
    );
  } catch (err: any) {
    if (err.code === "ECONNREFUSED") {
      setTimeout(() => handleConnection(elapsedTime + 100), 100);
    } else {
      logger.error("Error connecting to MySQL: ");
      logger.error(err);
      logger.info("Retrying MySQL connection 5 seconds...");
      setTimeout(() => handleConnection(elapsedTime + 5000), 5000);
    }
  }
}

handleConnection();

export default pool;
