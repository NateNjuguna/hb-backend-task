const expressJWT = require('express-jwt');

const audience = 'U0dGamEyVnlZbUY1U1hORGIyOXM';
const secret = Buffer.from(process.env.HB_SECRET, 'ascii');

module.exports = expressJWT({ secret, audience });
