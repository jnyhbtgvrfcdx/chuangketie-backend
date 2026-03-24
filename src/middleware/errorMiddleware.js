const { fail } = require('../utils/response');

function notFoundHandler(req, res) {
  res.status(404).json(fail(`Not Found: ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json(fail(message, status));
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
