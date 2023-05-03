const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`; // err.path is the field that is invalid and err.value is the value that is invalid
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // this is a regular expression to extract the value from the error message
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); // this is an array of all the error messages

  const message = `Invalid input data. ${errors.join('. ')}`; // this is an array of all the error messages
  return new AppError(message, 400);
};

// only works in production
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (err) => {
  const message = `Your token has expired. Please log in again!`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  // send error to client
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // stack trace
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    // operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or other unknown error: don't leak error details
    // 1) log error
    console.error('ERROR 💥', err);

    // 2) send generic message if not operational error
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500; // if there is no status code, set it to 500
  err.status = err.status || 'error'; // if there is no status, set it to error

  if (process.env.NODE_ENV === 'development') {
    // send error to client
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // create a copy of the error object

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      // error.code is the error code from MongoDB
      // duplicate field error
      const message = `Duplicate field value: ${error.keyValue.name}. Please use another value!`;
      error = new AppError(message, 400);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      // error.code is the error code from MongoDB
      // duplicate field error
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      // error.code is the error code from MongoDB
      // duplicate field error
      error = handleJWTExpiredError();
    }
    // send error to client
    sendErrorProd(error, res);
  }
};

// you could create different error categories like, non urgent, critical etc.
// you could also create different error handlers for different types of errors
// you could also create different error handlers for different environments
