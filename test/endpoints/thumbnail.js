const sharp = require('sharp');

const testURLs = {
  invalid: {
    badFormat: {
      notUrl: 'https://via.placeholder.com/350x150',
    },
    badScheme: {
      url: 'ftp://ftp.mirror.nl/robots.txt',
    },
    doesNotExist: {
      url: 'https://github.com/hackerbay/interview-backend-task/nate.png',
    },
    notAnImage: {
      url: 'https://github.com/hackerbay/interview-backend-task',
    },
  },
  valid: {
    larger: {
      url: 'https://via.placeholder.com/100x150',
    },
    same: {
      url: 'https://via.placeholder.com/50x50',
    },
    smaller: {
      url: 'https://via.placeholder.com/35x50',
    },
  },
};

module.exports = (assert, chaiRequest, token) => new Promise((resolve) => {
  // Test the thumbnail generation endpoint of the microservice
  suite('Generate Thumbnail Endpoint - /thumbnail', () => {
    // Test a disallowed HTTP Method
    suite('GET /thumbnail', () => {
      test('should return HTTP Error Code 405 - Method Not Allowed', (done) => {
        chaiRequest
          .get('/thumbnail')
          .then((res) => {
            assert.equal(res.status, 405, 'The response status is not "405"');
            done();
          })
          .catch(done);
      });
    });
    // Test an allowed method without Authorization
    suite('POST /thumbnail NULL (without Authorization)', () => {
      test('should return HTTP Error Code 401 - Unauthorized', (done) => {
        chaiRequest
          .post('/thumbnail')
          .send(null)
          .then((res) => {
            assert.equal(res.status, 401, 'The response status is not "401"');
            done();
          })
          .catch(done);
      });
    });
    /**
     * Test with Authorization
     */
    // Test a valid Authorization Header only
    suite('POST /thumbnail NULL (with Authorization)', () => {
      test('should return HTTP Error Code 400 - Bad request', (done) => {
        chaiRequest
          .post('/thumbnail')
          .set('Authorization', `Bearer ${token}`)
          .send(null)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    /**
     * Test the endpoint with an invalid body and valid authorization for:-
     */
    // 1. invalid data in the body
    suite(`POST /thumbnail ${JSON.stringify(testURLs.invalid.badFormat)} (with Authorization)`, () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .post('/thumbnail')
          .set('Authorization', `Bearer ${token}`)
          .send(testURLs.invalid.badFormat)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    // 2. invalid url scheme
    suite(`POST /thumbnail ${JSON.stringify(testURLs.invalid.badScheme)} (with Authorization)`, () => {
      test('should return HTTP Error Code 500 - Internal Server Error', (done) => {
        chaiRequest
          .post('/thumbnail')
          .set('Authorization', `Bearer ${token}`)
          .send(testURLs.invalid.badScheme)
          .then((res) => {
            assert.equal(res.status, 500, 'The response status is not "500"');
            done();
          })
          .catch(done);
      });
    });
    // 3. a non-existent url
    suite(`POST /thumbnail ${JSON.stringify(testURLs.invalid.doesNotExist)} (with Authorization)`, () => {
      test('should return HTTP Error Code 404 - Not Found', (done) => {
        chaiRequest
          .post('/thumbnail')
          .set('Authorization', `Bearer ${token}`)
          .send(testURLs.invalid.doesNotExist)
          .then((res) => {
            assert.equal(res.status, 404, 'The response status is not "404"');
            done();
          })
          .catch(done);
      });
    });
    // 4. an existing non-image file url
    suite(`POST /thumbnail ${JSON.stringify(testURLs.invalid.notAnImage)}`, () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .post('/thumbnail')
          .set('Authorization', `Bearer ${token}`)
          .send(testURLs.invalid.notAnImage)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    // Test an image larger than 50x50 dimensions
    suite(`POST /thumbnail ${JSON.stringify(testURLs.valid.larger)} (valid image larger than 50 x 50)`, () => {
      const requestPromise = chaiRequest
        .post('/thumbnail')
        .set('Authorization', `Bearer ${token}`)
        .send(testURLs.valid.larger);
      test('should return HTTP Success Code 200 - OK', (done) => {
        requestPromise.then((res) => {
          assert.equal(res.status, 200, 'The response status is not "200"');
          done();
        }).catch(done);
      });
      test('should return an image in the HTTP body', (done) => {
        requestPromise.then((res) => {
          assert.include(res.header['content-type'], 'image/png', 'The response Content-Type is not that of an image');
          assert.isNotEmpty(res.body, 'The response body is empty');
          done();
        }).catch(done);
      });
      test('should return an image with 50x50 dimensions', (done) => {
        requestPromise.then((res) => {
          sharp(res.body)
            .metadata()
            .then((metadata) => {
              const { height, width } = metadata;
              assert.equal(`${height}x${width}`, '50x50', `The image returned is not 50x50 but ${width}x${height}`);
              done();
            });
        }).catch(done);
      });
    });
    // Test an image with exactly 50x50 dimensions
    suite(`POST /thumbnail ${JSON.stringify(testURLs.valid.same)} (valid image equal to 50 x 50)`, () => {
      const requestPromise = chaiRequest
        .post('/thumbnail')
        .set('Authorization', `Bearer ${token}`)
        .send(testURLs.valid.same);
      test('should return HTTP Success Code 200 - OK', (done) => {
        requestPromise.then((res) => {
          assert.equal(res.status, 200, 'The response status is not "200"');
          done();
        }).catch(done);
      });
      test('should return an image in the HTTP body', (done) => {
        requestPromise.then((res) => {
          assert.include(res.header['content-type'], 'image/png', 'The response Content-Type is not that of an image');
          assert.isNotEmpty(res.body, 'The response body is empty');
          done();
        }).catch(done);
      });
      test('should return an image with 50x50 dimensions', (done) => {
        requestPromise.then((res) => {
          sharp(res.body)
            .metadata()
            .then((metadata) => {
              const { height, width } = metadata;
              assert.equal(`${height}x${width}`, '50x50', `The image returned is not 50x50 but ${width}x${height}`);
              done();
            });
        }).catch(done);
      });
    });
    // Test an image smaller than 50x50 dimensions
    suite(`POST /thumbnail ${JSON.stringify(testURLs.valid.smaller)} (valid image smaller than 50 x 50)`, () => {
      const requestPromise = chaiRequest
        .post('/thumbnail')
        .set('Authorization', `Bearer ${token}`)
        .send(testURLs.valid.smaller);
      test('should return HTTP Success Code 200 - OK', (done) => {
        requestPromise.then((res) => {
          assert.equal(res.status, 200, 'The response status is not "200"');
          done();
        }).catch(done);
      });
      test('should return an image in the HTTP body', (done) => {
        requestPromise.then((res) => {
          assert.include(res.header['content-type'], 'image/png', 'The response Content-Type is not that of an image');
          assert.isNotEmpty(res.body, 'The response body is empty');
          done();
        }).catch(done);
      });
      test('should return an image with 50x50 dimensions', (done) => {
        requestPromise.then((res) => {
          sharp(res.body)
            .metadata()
            .then((metadata) => {
              const { height, width } = metadata;
              assert.equal(`${height}x${width}`, '50x50', `The image returned is not 50x50 but ${width}x${height}`);
              done();
            });
        }).catch(done);
      });
      // Resolve the promise
      suiteTeardown(() => {
        resolve();
      });
    });
  });
});
