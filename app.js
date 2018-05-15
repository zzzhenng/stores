const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator');
const passport = require('passport');
const promisify = require('es6-promisify');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// app.use((req, res, next) => {
  // req.login = promisify(req.login, req);
  // next();
// });

app.use('/', routes);

// not found middleware
app.use(errorHandlers.notFound);

app.use(errorHandlers.flashValidationErrors);

app.use(errorHandlers.developmentErrors);

// export it so we can start the site in start.js
module.exports = app;
