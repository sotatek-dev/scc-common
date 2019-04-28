import winston from 'winston';
import util from 'util';
import { CCEnv } from '..';
const WinstonCloudWatch = require('winston-cloudwatch');
const nodemailer = require('nodemailer');

let ERROR_STASHES: string[] = [];

setInterval(() => {
  if (ERROR_STASHES.length > 0) {
    notifyErrors(ERROR_STASHES);
    ERROR_STASHES = [];
  }
}, 60000);

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

export function getLogger(name: string, isCloudWatch: boolean = false) {
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
      })
    );

    winston.loggers.add(name, {
      level: 'debug',
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
      return winston.loggers.get(name).debug(msg);
    },
    warn(msg: any) {
      ERROR_STASHES.push(`[WARN] ${msg}<br><br>`);
      return winston.loggers.get(name).warn(msg);
    },
    error(msg: any) {
      // Setup error
      ERROR_STASHES.push(`[ERROR] ${msg}<br><br>`);

      // const credentials = s3.config.credentials;
      const env = process.env.NODE_ENV || 'development';

      if (env === 'production' || isCloudWatch) {
        const logger = winston.loggers.get(name);
        logger.transports.push(
          new WinstonCloudWatch({
            logGroupName: 'exchange-wallet',
            logStreamName: name,
            awsRegion: 'ap-southeast-1',
            jsonMessage: true,
          })
        );
      }
      return winston.loggers.get(name).error(msg);
    },
  };
}

async function notifyErrors(message: string[]) {
  const mailerAccount = CCEnv.getCustomEnvConfig('MAILER_ACCOUNT');
  const mailerPassword = CCEnv.getCustomEnvConfig('MAILER_PASSWORD');
  const mailerReceiver = CCEnv.getCustomEnvConfig('MAILER_RECEIVER');

  if (!mailerAccount || !mailerPassword || !mailerReceiver) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailerAccount,
      pass: mailerPassword,
    },
  });

  const mailOptions = {
    from: mailerAccount,
    to: mailerReceiver,
    subject: 'Exchange wallet: Error Notifier',
    html: `${message}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
