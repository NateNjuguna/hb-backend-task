const winston = require('winston');
const server = require('./server');

const { NODE_ENV } = process.env;
const logger = winston.createLogger({
  exitOnError: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.level.trim().toUpperCase()} - ${info.timestamp} - ${info.message}`),
  ),
  level: 'debug',
});

switch (NODE_ENV) {
  case 'production': {
    logger.emitErrs = false;
    logger.exitOnError = false;
    logger.add(new winston.transports.File({ filename: 'hb-backend-task_error.log', handleExceptions: true, level: 'warn' }));
    break;
  }
  case 'test': {
    logger.add(new winston.transports.File({ filename: 'hb-backend-task_test.log', handleExceptions: true, level: 'debug' }));
    break;
  }
  default: {
    logger.add(new winston.transports.Console({ level: 'debug' }));
    logger.add(new winston.transports.File({ filename: 'hb-backend-task_debug.log', handleExceptions: true, level: 'debug' }));
    break;
  }
}

module.exports = {
  logger,
  server: server(logger),
};
