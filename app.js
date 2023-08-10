/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
const path = require('path');
const express = require('express');
const res = require('express/lib/response');
const req = require('express/lib/request');
const { json } = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", 'https://unpkg.com/axios/dist/axios.min.js'],
        'connect-src': ["'self'", 'http://127.0.0.1:3000'],
      },
    },
  }),
);

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const reviewRouter = require('./routes/review-routes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, try again later',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// eslint-disable-next-line no-shadow
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies.jwt);
  console.log(req.cookies);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
