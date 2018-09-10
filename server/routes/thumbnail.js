const http = require('http');
const https = require('https');
const { isURL } = require('validator');
const sharp = require('sharp');
const errors = require('../../lib/errors');

module.exports = (req, res, next) => {
  if (Boolean(req.body.url) && isURL(req.body.url)) {
    const client = req.body.url.indexOf('https') > -1 ? https : http;
    client.get(req.body.url, (result) => {
      if (result.statusCode === 200) {
        let rawData = Buffer.alloc(0);
        result.on('data', (chunk) => {
          rawData = Buffer.concat([rawData, chunk]);
        });
        result.on('end', () => {
          sharp(rawData)
            .resize(50, 50, {
              kernel: sharp.kernel.nearest,
            })
            .png()
            .toBuffer()
            .then((data) => {
              res.type('image/png');
              res.send(data);
            })
            .catch((err) => {
              const e = Object.create(err);
              e.status = 400;
              next(e);
            });
        });
      } else {
        result.resume();
        next(new errors.HTTPError(result.statusCode));
      }
    });
  } else {
    next(new errors.HTTPError(400));
  }
};
