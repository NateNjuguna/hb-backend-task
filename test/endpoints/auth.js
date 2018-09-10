const JWT = require('jsonwebtoken');

const JWTAudience = 'U0dGamEyVnlZbUY1U1hORGIyOXM';
const JWTSecret = Buffer.from(process.env.HB_SECRET, 'ascii');

module.exports = (assert, chaiRequest) => new Promise((resolve, reject) => {
  // Test the login endpoint of the microservice
  suite('Login Endpoint - /auth', () => {
    // Test a disallowed HTTP method
    suite('GET /auth', () => {
      test('should return HTTP Error Code 405 - Method Not Allowed', () => chaiRequest.get('/auth').then((res) => {
        assert.equal(res.status, 405, 'The response status is not "405"');
      }));
    });
    // Test an allowed method with no(invalid) data
    suite('POST /auth NULL (no data)', () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .post('/auth')
          .send(null)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    /**
     * Test a valid method with invalid data
     */
    // Test an invalid email
    suite('POST /auth {"email":"foobar","password":"password"}', () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .post('/auth')
          .send({
            email: 'foobar',
            password: 'password',
          })
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    // Test an invalid password
    suite('POST /auth {"email":"foobar@gmail.com","password":null} (invalid password)', () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .post('/auth')
          .send({
            email: 'foobar@gmail.com',
            password: null,
          })
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    /**
     * Test the endpoint for a valid scenario
     * i.e. a valid method and valid data
     */
    suite('POST /auth {"email":"foobar@gmail.com","password":"password"}', () => {
      const requestPromise = chaiRequest
        .post('/auth')
        .send({
          email: 'foobar@gmail.com',
          password: 'password',
        });
      let body;
      let token;
      test('should return HTTP Success Code 200 - OK', (done) => {
        requestPromise.then((res) => {
          assert.equal(res.status, 200, 'The response status is not "200"');
          done();
        }).catch(done);
      });
      test('should return a JSON document', (done) => {
        requestPromise.then((res) => {
          assert.include(res.header['content-type'], 'application/json', 'The response Content-Type is not JSON');
          assert.isNotEmpty(res.text, 'The response body is empty');
          assert.doesNotThrow(() => {
            body = JSON.parse(res.text);
          }, SyntaxError, 'The response body is not valid JSON');
          done();
        }).catch(done);
      });
      test('should return a JSON document with a "token" key (i.e. {..., "token":"XXXXXXX", ...})', (done) => {
        requestPromise.then(() => {
          assert.property(body, 'token', 'The JSON body does not include a token.');
          assert.isNotEmpty(body.token, 'The JSON body does includes a token but it is empty.');
          ({ token } = body);
          done();
        }).catch(done);
      });
      test('should return a valid token in the JSON body', (done) => {
        requestPromise.then(() => {
          function fn() {
            JWT.verify(token, JWTSecret, {
              aud: JWTAudience,
            });
          }
          assert.doesNotThrow(fn, JWT.JsonWebTokenError, 'The token is not a valid JWT');
          assert.doesNotThrow(fn, JWT.NotBeforeError, 'The token is not ready to be used yet JWT (nbf limit)');
          assert.doesNotThrow(fn, JWT.TokenExpiredError, 'The token is an already expired JWT');
          done();
        }).catch(done);
      });
      // Resolve the promise if the token is not undefined
      suiteTeardown(() => {
        if (token === undefined) {
          reject(new Error('No token returned'));
        } else {
          resolve(token);
        }
      });
    });
  });
});
