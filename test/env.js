const proxyquire = require('proxyquire').noPreserveCache();

let logger;

module.exports = (chai, assert) => {
  suite('Set NODE_ENV=test', () => {
    // Test logger environment
    suiteSetup(() => {
      process.env.NODE_ENV = 'test';
      ({ logger } = proxyquire('../index.js', {
        process,
        './server': () => {},
      }));
    });
    test('should have a logger transport for the "debug" level', () => {
      const transport = logger.transports.find(trans => trans.level === 'debug');
      assert.isNotEmpty(transport, 'A transport with maximum log level of "debug" does not exist');
    });
  });
  // Production environment
  suite('Set NODE_ENV=production', () => {
    // Test logger level
    suiteSetup(() => {
      process.env.NODE_ENV = 'production';
      ({ logger } = proxyquire('../index.js', {
        process,
        './server': () => {},
      }));
    });
    test('should have a transport that logs at "warn" level', () => {
      const transport = logger.transports.find(trans => trans.level === 'warn');
      assert.isNotEmpty(transport, 'A transport with maximum log level of "warn" does not exist');
    });
  });
  // Production environment
  suite('Set NODE_ENV=development', () => {
    // Test logger level
    suiteSetup(() => {
      process.env.NODE_ENV = 'development';
      ({ logger } = proxyquire('../index.js', {
        process,
        './server': () => {},
      }));
    });
    test('should have a transport that logs at "debug" level', () => {
      const transport = logger.transports.find(trans => trans.level === 'debug');
      assert.isNotEmpty(transport, 'A transport with maximum log level of "debug" does not exist');
    });
  });
  // Default port
  suite('Unset HB_PORT', () => {
    let server;
    suiteSetup(() => {
      process.env.NODE_ENV = 'test';
      delete process.env.HB_AUD;
      delete process.env.HB_PORT;
      delete process.env.HB_SECRET;
      ({ server } = proxyquire('../index.js', { process }));
    });
    // Test default port
    test('should serve HTTP on default port 3000', () => {
      assert.equal(server.address().port, 3000, `The server is running on a different port :${server.address().port}`);
    });
    // Close the HTTP server
    suiteTeardown(() => {
      server.close();
    });
  });
};
