const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION ERROR!!!!!!!');
  process.exit(1);
});

dotenv.config({ path: './../starter/config2.env' });
const app = require('./app');

// console.log(process.env.DTATBASE);

const DB = process.env.DATATBASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(con => {
    console.log('Database connection successful.');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('app running on port 3000...');
  console.log(process.env.NODE_ENV);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ERROR!!!!!!!');
  server.close(() => {
    process.exit(1);
  });
});
