const { createLogger, transports, format } = require('winston');
var winston = require('winston');
require('winston-papertrail').Papertrail;
const { PAPER_TRAIL_HOST, PAPER_TRAIL_PORT } = require('../config')

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: './logs/all-logs.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
    new winston.transports.Papertrail({
        host: PAPER_TRAIL_HOST,
        port: PAPER_TRAIL_PORT
      })
  ]
});

module.exports = {logger};