module.exports = logger => (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  logger.error(`${req.method} ${req.originalUrl} ${err.message || 'Bad request from client'}`);
  res.type('text/plain');
  switch (err.status) {
    case 400:
      res.status(400).send(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ERROR. Something is wrong with your request. Verify that you are correct and try again.`);
      break;
    case 401:
      res.status(401).send(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ERROR. You are not authorized to access this URL. Make sure your authorization token exists and is valid.`);
      break;
    case 405:
      res.status(405).send(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ERROR. This HTTP method is not allowed on this URL.`);
      break;
    case 500:
    case undefined:
      res.status(500).send(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ERROR. Something bad happened and we were unable to complete your request. If this occurs more than once report it to us.`);
      break;
    case 404:
    default:
      res.status(404).send(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ERROR. The URL was not found.`);
      break;
  }
};
