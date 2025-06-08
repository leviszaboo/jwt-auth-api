import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  level: process.env.LOG_LEVEL || "info",
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,req,res,responseTime",
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
