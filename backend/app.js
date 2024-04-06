//*Package imports
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

//*check environment in backend/config/index.js to determine isProduction true/false
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express(); //*initialize the Express app

app.use(morgan('dev')); //*connecting morgan middleware for logging req/res info

app.use(cookieParser()); //* connect cookie-parser middleware
app.use(express.json()); //* parses JSON bodies of req w/ Content-Type of 'application/json'

//!Security Middleware measures
if (!isProduction) {
  app.use(cors()); //* enable cors only in development
}

//* helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

//* Set the _csrf token and create req.csrfToken method
//*csurf middleware add a _csrf cookie and a XSRF-TOKEN cookie
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true,
    },
  })
);

//*adding routes to express app and connecting exported router to app after middlewares
const routes = require('./routes');
app.use(routes);

//*error handling middlewares

//* regular middleware that catches any requests that dont match any of the defined routes and creates a server error with a status code of 404 - the next will pass the error status on to the error handling middleware

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

const { ValidationError } = require('sequelize');
// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);

  const errors = {
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
  };

  if (!isProduction) {
    errors.stack = err.stack;
  }

  res.json(errors);
});

module.exports = app;
