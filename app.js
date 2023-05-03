// REQUIRE MODULES
const express = require('express');
const morgan = require('morgan');

// IMPORT ROUTES
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // middleware to parse the body of the request

// Serve static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // eslint-disable-next-line no-console
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers); // to see the headers that the client sends to the server
  next();
});

// ROUTES - Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Old method to create routes
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
//

// ERROR HANDLING MIDDLEWARE - 404 error handler for all other routes that are not defined above
// Should be the last part after all the other routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });
  //   const err = new Error(`Can't find ${req.originalUrl} on this server`);
  //   err.statusCode = 404;
  //   err.status = 'fail';
  // whenever we pass an argument into the next function express will assume it is an error, express will automatically know that there is an error
  // next(err); // passing the error to the next middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ERROR HANDLING MIDDLEWARE - Global error handler
app.use(globalErrorHandler);

module.exports = app;
