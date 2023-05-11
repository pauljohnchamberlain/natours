const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); //& { $env:NODE_ENV = "development"; nodemon server.js }

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () =>
    console.log(`App running on port ${port}...`)
  );

  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
});

// heroku logs --tail
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
