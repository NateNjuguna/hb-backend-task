const chaiHTTP = require('chai-http');
const { logger, server } = require('../index');
const authTests = require('./endpoints/auth');
const patchTests = require('./endpoints/patch');
const thumbnailTests = require('./endpoints/thumbnail');

module.exports = (chai, assert) => {
  chai.use(chaiHTTP);
  const chaiRequest = chai.request(server).keepOpen();

  // Test the root url of the server
  suite('GET /', () => {
    test('should return HTTP Error Code 404 - Not Found', () => chaiRequest.get('/').then((res) => {
      assert.equal(res.status, 404, 'The response status is not "404"');
    }));
  });
  // Endpoint tests
  authTests(assert, chaiRequest)
    .then(token => patchTests(assert, chaiRequest, token))
    .then(token => thumbnailTests(assert, chaiRequest, token))
    .catch((err) => {
      logger.error(err);
    });
};
