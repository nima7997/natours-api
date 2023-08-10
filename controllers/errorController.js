const AppError = require('./../utils/appError');

const handleCastError = err => {
  const message = `inavlid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Dupliacate value: ${err.keyValue.name} please use another value!`;
  return new AppError(message, 400);
}; // Suck my PP 8--> <3

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('invalid token please login again', 401);
const handExpiredTokenError = () =>
  new AppError('token exired please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    if (error.name === 'CastError') {
      error = handleCastError(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handExpiredTokenError();
    sendErrorProd(error, res);
  }
};
