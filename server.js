const mongoose = require('mongoose');
const dotenv = require('dotenv');

// uncaught EXCEPTIONS - this is for errors that are not related to the code, like a bug in a package. Should be at the top of the code
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
  // we need to close the server first before exiting the application
  process.exit(1); // 0 for success, 1 for uncaught exception
});

dotenv.config({ path: './config.env' }); // this will read the variables from the config.env file and save them to node.js environment variables. Must be before the next line
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //   .connect(process.env.DATABASE_LOCAL) {}
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection successful!');
  });
// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);

// creating a test tour
// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 297,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR: ', err);
//   }); // later we will use async/await

// START SERVER - Set up port to listen to requests
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on ${port}`);
});

// unhandled REJECTIONS - this is for errors that are not related to the code, like a bug in a package
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNHANDLED REJECTION! Shutting down...');
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
  server.close(() => {
    // we need to close the server first before exiting the application
    process.exit(1); // 0 for success, 1 for unhandled rejection
  });
});
