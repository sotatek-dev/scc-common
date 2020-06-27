import _ from 'lodash';
import winston from 'winston';
import Transport from 'winston-transport';
import util from 'util';
import WinstonCloudWatch from 'winston-cloudwatch';

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

export function getLogger(name: string): winston.Logger {
  const isLoggerExisted = winston.loggers.has(name);
  if (!isLoggerExisted) {
    createLogger(name);
  }

  return winston.loggers.get(name);
}

function createLogger(name: string) {
  const transports: Transport[] = [];

  // Console is default logger
  const consoleTransport = _createConsoleTransport();
  transports.push(consoleTransport);

  // If CloudWatch log is enabled, add them to transports list
  if (process.env.CWL_ENABLED === 'true') {
    const cwlTransport = _createCwlTransport();
    transports.push(cwlTransport);
  }

  winston.loggers.add(name, {
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(enumerateErrorFormat()),
    transports,
  });
}

function _createConsoleTransport(): Transport {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(info => {
        const { timestamp, level, message, ...extra } = info;

        return `${timestamp} [${level}]: ${message} ${Object.keys(extra).length ? util.inspect(extra) : ''}`;
      })
    ),
    stderrLevels: ['error'],
  });
}

function _createCwlTransport(): Transport {
  const logGroupName = process.env.CWL_LOG_GROUP_NAME || 'sotatek-scc-common';
  const logStreamPrefix = process.env.CWL_LOG_STREAM_PREFIX || 'sotatek-scc-common';
  const createdDate = new Date().toISOString().split('T')[0];
  const randomSuffix = Math.random().toString(36).substr(2, 5);
  const logStreamName = `${logStreamPrefix}:${createdDate}-${randomSuffix}`;
  const uploadRate = process.env.CWL_UPLOAD_RATE ? parseInt(process.env.CWL_UPLOAD_RATE, 10) : undefined;

  return new WinstonCloudWatch({
    level: process.env.CWL_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
    logGroupName,
    logStreamName,
    jsonMessage: true,
    uploadRate,
    awsAccessKeyId: process.env.CWL_AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.CWL_AWS_ACCESS_KEY_SECRET,
    awsRegion: process.env.CWL_AWS_REGION_ID,
  });
}
