const errors = require('../../lib/errors');
const auth = require('./auth');
const errorHandler = require('./errorHandler');

module.exports = {
  authorize: auth,
  error: code => (req, res, next) => {
    next(new errors.HTTPError(code));
  },
  errorHandler,
  requireBody: contentType => (req, res, next) => {
    if (req.is(contentType) && req.body !== undefined) {
      next();
    } else {
      next(new errors.HTTPError(400));
    }
  },
};
