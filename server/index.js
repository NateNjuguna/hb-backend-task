const express = require('express');
const middleware = require('./middleware');
const routes = require('./routes');

const { HB_PORT = 3000 } = process.env;

module.exports = (logger) => {
  const app = express();
  const router = express.Router();

  app.use(express.json());
  app.use('/', routes(router, middleware));
  app.use(middleware.errorHandler(logger));

  const server = app.listen(HB_PORT, '0.0.0.0', () => {
    logger.info(`HB-Backend-Task listening at http://${server.address().address}:${HB_PORT}`);
  });

  return server;
};
