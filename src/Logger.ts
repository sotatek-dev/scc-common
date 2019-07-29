import winston from 'winston';
import util, { isNumber } from 'util';
import EnvConfigRegistry from './registries/EnvConfigRegistry';
const WinstonCloudWatch = require('winston-cloudwatch');
const nodemailer = require('nodemailer');

let ERROR_STASHES: string[] = [];
let ERROR_SENDING_INTERVAL: number;
if (process.env.ERROR_SENDING_INTERVAL) {
  ERROR_SENDING_INTERVAL = parseInt(process.env.ERROR_SENDING_INTERVAL, 10);
}

// Default interval is 15 minutes
if (!ERROR_SENDING_INTERVAL || isNaN(ERROR_SENDING_INTERVAL)) {
  ERROR_SENDING_INTERVAL = 900000;
}

setInterval(notifyErrors, ERROR_SENDING_INTERVAL);

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
      return winston.loggers.get(name).info(msg);
    },
    warn(msg: any) {
      return winston.loggers.get(name).warn(msg);
    },
    error(msg: any) {
      return winston.loggers.get(name).error(msg);
    },
    fatal(msg: any) {
      // Setup error
      ERROR_STASHES.push(`[ERROR] ${msg}`);

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
    async notifyErrorsImmediately() {
      try {
        await notifyErrors();
      } catch (err) {
        console.error(`======= UNCAUGHT ERROR NOTIFYING BEGIN =======`);
        console.error(err);
        console.error(`======= UNCAUGHT ERROR NOTIFYING END =======`);
      }
    },
  };
}

async function notifyErrors() {
  if (!ERROR_STASHES.length) {
    return;
  }

  const messages = ERROR_STASHES;
  ERROR_STASHES = [];

  const mailerAccount = EnvConfigRegistry.getCustomEnvConfig('MAILER_ACCOUNT');
  const mailerPassword = EnvConfigRegistry.getCustomEnvConfig('MAILER_PASSWORD');
  const mailerReceiver = EnvConfigRegistry.getCustomEnvConfig('MAILER_RECEIVER');

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

  const appName: string = process.env.APP_NAME || 'Exchange Wallet';
  const env: string = process.env.NODE_ENV || 'development';

  const mailOptions = {
    from: mailerAccount,
    to: mailerReceiver,
    subject: `[${appName}][${env}] Error Notifier`,
    html: `${messages.join('<br />')}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error(`======= SENDING EMAIL ERROR BEGIN =======`);
    console.error(err);
    console.error(`======= SENDING EMAIL ERROR END =======`);
  }
}
