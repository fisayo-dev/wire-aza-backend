import { LoggerType } from "../types/enums/logger.ts";

export const logger = (msg: string, type: LoggerType = LoggerType.log) => {
  switch (type) {
    case LoggerType.log:
      return console.log(msg);
    case LoggerType.warn:
      return console.warn(msg);
    case LoggerType.info:
      return console.info(msg);
    case LoggerType.error:
      return console.error(msg);
    default:
      return console.log(msg);
  }
};
