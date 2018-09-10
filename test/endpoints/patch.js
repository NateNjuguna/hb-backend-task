const patchTestJSON = {
  invalid: {
    body: {
      property: 'value',
    },
    syntax: {
      document: {
        name: 'Nathan Njuguna',
      },
      patch: [{
        op: 'remove',
        path: '/age',
      }],
    },
  },
  valid: {
    multiple: {
      document: {
        name: 'Nathan Njuguna',
        nickNames: ['Nate', 'Professor'],
      },
      patch: [{
        op: 'add',
        path: '/age',
        value: 24,
      }, {
        op: 'add',
        path: '/nickNames/1',
        value: 'Njugush',
      }],
    },
    single: {
      document: {
        name: 'Nathan Njuguna',
      },
      patch: {
        op: 'add',
        path: '/nickNames',
        value: ['Nate', 'Njugush'],
      },
    },
  },
};

module.exports = (assert, chaiRequest, token) => new Promise((resolve) => {
  // Test the JSON patch endpoint of the microservice
  suite('JSON Patch Endpoint - /patch', () => {
    // Test a disallowed HTTP method
    suite('GET /patch', () => {
      test('should return HTTP Error Code 405 - Method Not Allowed', (done) => {
        chaiRequest
          .get('/patch')
          .then((res) => {
            assert.equal(res.status, 405, 'The response status is not "405"');
            done();
          })
          .catch(done);
      });
    });
    // Test an allowed method without Authorization
    suite('PATCH /patch NULL (without Authorization)', () => {
      test('should return HTTP Error Code 401 - Unauthorized', (done) => {
        chaiRequest
          .patch('/patch')
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
    suite('PATCH /patch NULL (with HTTP Header - Authorization: Bearer XXXXXX)', () => {
      test('should return HTTP Error Code 400 - Bad request', (done) => {
        chaiRequest
          .patch('/patch')
          .set('Authorization', `Bearer ${token}`)
          .send(null).then((res) => {
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
    suite(`PATCH /patch ${JSON.stringify(patchTestJSON.invalid.body)}`, () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .patch('/patch')
          .set('Authorization', `Bearer ${token}`)
          .send(patchTestJSON.invalid.body)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    // 1. invalid JSON-Patch operation syntax
    suite(`PATCH /patch ${JSON.stringify(patchTestJSON.invalid.syntax)}`, () => {
      test('should return HTTP Error Code 400 - Bad Request', (done) => {
        chaiRequest
          .patch('/patch')
          .set('Authorization', `Bearer ${token}`)
          .send(patchTestJSON.invalid.syntax)
          .then((res) => {
            assert.equal(res.status, 400, 'The response status is not "400"');
            done();
          })
          .catch(done);
      });
    });
    /**
     * Test the endpoint with a valid body and valid authorization for:-
     */
    // 1. a single patch operation
    suite(`PATCH /patch ${JSON.stringify(patchTestJSON.valid.single)} (with Authorization)`, () => {
      const requestPromise = chaiRequest
        .patch('/patch')
        .set('Authorization', `Bearer ${token}`)
        .send(patchTestJSON.valid.single);
      let body;
      test('should return HTTP Success Code 200 - OK', (done) => {
        requestPromise.then((res) => {
          assert.equal(res.status, 200, 'The response status is not "400"');
          done();
        }).catch(done);
      });
      test('should return a JSON document', (done) => {
        requestPromise.then((res) => {
          assert.include(res.header['content-type'], 'application/json', 'The response Content-Type is not JSON');
          assert.isNotEmpty(res.text, 'The response body is empty');
          assert.doesNotThrow(() => {
            body = JSON.parse(res.text);
          }, SyntaxError, 'The response body is not valid JSON.');
          done();
        }).catch(done);
      });
      test('should return a correctly patched JSON document - {"name":"Nathan Njuguna","nickNames":["Nate","Njugush"]}', (done) => {
        requestPromise.then(() => {
          assert.hasAllKeys(body, ['name', 'nickNames'], 'The JSON document is missing a key.');
          assert.isString(body.name, 'The JSON document has an incorrect "name" property type');
          assert.equal(body.name, 'Nathan Njuguna', 'The JSON document has an incorrect "name" property value');
          assert.isArray(body.nickNames, 'The JSON document has an incorrect "nickNames" property key');
          assert.sameMembers(body.nickNames, ['Nate', 'Njugush'], 'The JSON document has an incorrect "nickNames" property value');
          done();
        }).catch(done);
      });
    });
    // 2. multiple patch operations
    suite(`PATCH /patch ${JSON.stringify(patchTestJSON.valid.multiple)}`, () => {
      const requestPromise = chaiRequest
        .patch('/patch')
        .set('Authorization', `Bearer ${token}`)
        .send(patchTestJSON.valid.multiple);
      let body;
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
          }, SyntaxError, 'The response body is not valid JSON.');
          done();
        }).catch(done);
      });
      test('should return a correctly patched JSON document - {"age":24,name":"Nathan Njuguna","nickNames":["Nate","Professor","Njugush"]}', (done) => {
        requestPromise.then(() => {
          assert.hasAllKeys(body, ['age', 'name', 'nickNames'], 'The JSON document is missing a key.');
          assert.isNumber(body.age, 'The JSON document has an incorrect "age" property type');
          assert.equal(body.age, 24, 'The JSON document has an incorrect "age" property value');
          assert.isString(body.name, 'The JSON document has an incorrect "name" property type');
          assert.equal(body.name, 'Nathan Njuguna', 'The JSON document has an incorrect "name" property value');
          assert.isArray(body.nickNames, 'The JSON document has an incorrect "nickNames" property key');
          assert.sameMembers(body.nickNames, ['Nate', 'Professor', 'Njugush'], 'The JSON document has an incorrect "nickNames" property value');
          done();
        }).catch(done);
      });
      // resolve the promise
      suiteTeardown(() => {
        resolve(token);
      });
    });
  });
});
