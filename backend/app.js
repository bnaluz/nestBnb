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

module.exports = app;
