const JSONPatch = require('json-patch');
const errors = require('../../lib/errors');

module.exports = (req, res, next) => {
  if (Boolean(req.body.document) && Boolean(req.body.patch)) {
    try {
      const result = JSONPatch.apply(req.body.document, req.body.patch);
      res.json(result);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  } else {
    next(new errors.HTTPError(400));
  }
};
