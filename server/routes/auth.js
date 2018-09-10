const JWT = require('jsonwebtoken');
const { isEmail } = require('validator');
const errors = require('../../lib/errors');

const audience = 'U0dGamEyVnlZbUY1U1hORGIyOXM';
const secret = Buffer.from(process.env.HB_SECRET, 'ascii');

module.exports = time => (req, res, next) => {
  if (Boolean(req.body.email) && Boolean(req.body.password) && isEmail(req.body.email)) {
    const payload = {
      aud: audience,
      email: req.body.email,
      exp: time + Date.now(),
      iat: Date.now(),
      iss: `${req.protocol}://${req.hostname}`,
      sub: 'testUser',
    };
    JWT.sign(payload, secret, { algorithm: 'HS256' }, (err, token) => {
      res.json({ token });
    });
  } else {
    next(new errors.HTTPError(400));
  }
};
