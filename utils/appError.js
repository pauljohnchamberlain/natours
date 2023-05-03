class AppError extends Error {
  // we are extending the Error class with our own class. One class inherits from the other class
  constructor(message, statusCode) {
    // Constructor method is called each time we create a new object out of this class. We are passing the message and the statusCode.
    super(message); // super() is the same as Error.call(this, message)
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // if the statusCode starts with 4, then it is a fail, otherwise it is an error
    this.isOperational = true; // we will use this property to distinguish between operational errors and programming errors
    Error.captureStackTrace(this, this.constructor); // this will not appear in the stack trace and will not pollute it. The stack trace shows us where the error happened. console.log(err.stack);
  }
}

module.exports = AppError;
