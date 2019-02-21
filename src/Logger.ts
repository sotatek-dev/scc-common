import winston from 'winston';
// cannot use ts
const WinstonCloudWatch = require('winston-cloudwatch');

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

export function getLogger(name: string, isCloudWatch: boolean = false): winston.Logger {
  const has = winston.loggers.has(name);
  if (has) {
    return winston.loggers.get(name);
  }

  const transports: any[] = [];
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => {
          const { timestamp, level, message, ...extra } = info;

          return `${timestamp} [${level}]: ${message} ${
            Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
          }`;
        })
      ),
    })
  );

  // const credentials = s3.config.credentials;
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production' || isCloudWatch) {
    transports.push(
      new WinstonCloudWatch({
        logGroupName: 'exchange-wallet',
        logStreamName: name,
        awsRegion: 'ap-southeast-1',
        jsonMessage: true,
      })
    );
  }

  winston.loggers.add(name, {
    level: 'debug',
    format: winston.format.combine(enumerateErrorFormat()),
    transports,
  });
  return winston.loggers.get(name);
}
