import winston from 'winston';
import path from 'path';

const manualColorize = (strToColor: string): string => `[\x1b[35m${strToColor}\x1b[0m]`;

// Format handler passed to winston
const formatLogs = (log: winston.Logform.TransformableInfo): string => {
  if (log.module)
    return `${log.label} ${manualColorize(log.module)} [${log.level}]: ${log.message}`;

  return `${log.label} [${log.level}]: ${log.message}`;
};

const findLogPath = () =>
  `${path.join(GetResourcePath(GetCurrentResourceName()), 'sv-tCore.log')}`;

export const mainLogger = winston.createLogger({
  level: process.env.DEBUG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: '[t-core]' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(formatLogs)
      ),
    }),
  ],
});
