const chai = require('chai');
const environmentTests = require('./env');
const serverTests = require('./server');

const { assert } = chai;

/**
 * Test NodeJS environments: "test", "production" and "development"
 */
suite('Environment Variable Tests', () => {
  environmentTests(chai, assert);
});
/**
 * Test the HTTP server
 */
suite('HTTP Server Tests', () => {
  serverTests(chai, assert);
});
