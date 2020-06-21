import _ from 'lodash';
import winston from 'winston';
import util from 'util';

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }
  return info;
});

export function getLogger(name: string) {
  const has = winston.loggers.has(name);
  if (!has) {
    const transports: any[] = [];
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(info => {
            const { timestamp, level, message, ...extra } = info;

            return `${timestamp} [${level}]: ${message} ${Object.keys(extra).length ? util.inspect(extra) : ''}`;
          })
        ),
        stderrLevels: ['error'],
      })
    );

    winston.loggers.add(name, {
      level: process.env.LOG_LEVEL || 'debug',
      format: winston.format.combine(enumerateErrorFormat()),
      transports,
    });
  }

  // return winston.loggers.get(name);
  return {
    debug(msg: any) {
      return winston.loggers.get(name).debug(msg);
    },
    info(msg: any) {
      return winston.loggers.get(name).info(msg);
    },
    warn(msg: any) {
      return winston.loggers.get(name).warn(msg);
    },
    error(msg: any) {
      return winston.loggers.get(name).error(msg);
    },
    fatal(msg: any) {
      return winston.loggers.get(name).error(msg);
    },
  };
}
