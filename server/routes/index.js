const auth = require('./auth');
const patch = require('./patch');
const thumbnail = require('./thumbnail');

module.exports = (router, middleware) => {
  // Login routes
  router.post('/auth', middleware.requireBody('application/json'), auth(3600));
  router.all('/auth', middleware.error(405));
  // JSON patching routes
  router.patch('/patch', [middleware.authorize, middleware.requireBody('application/json')], patch);
  router.all('/patch', middleware.error(405));
  // Thumbnail generation routes
  router.post('/thumbnail', [middleware.authorize, middleware.requireBody('application/json')], thumbnail);
  router.all('/thumbnail', middleware.error(405));
  // Error handling
  router.use(middleware.error(404));

  return router;
};
