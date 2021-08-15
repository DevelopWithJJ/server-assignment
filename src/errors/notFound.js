function notFound(req, res, next) {
  return next({
    status: 404,
    message: `Route not found ${req.originalUrl}`,
  });
}

module.exports = notFound;
