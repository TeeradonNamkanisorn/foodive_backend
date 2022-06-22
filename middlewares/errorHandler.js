module.exports = (err, req, res, next) => {
  console.log(err);

  if (
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeValidationError"
  ) {
    err.statusCode = 400;
    err.message = err.errors[0].message;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ message: err.message });
};
