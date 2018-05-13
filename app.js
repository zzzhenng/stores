const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  next();
});

app.use('/', routes);

// not found middleware
app.use(errorHandlers.notFound);

app.use(errorHandlers.developmentErrors);

// export it so we can start the site in start.js
module.exports = app;
