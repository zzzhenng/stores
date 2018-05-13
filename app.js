const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const helpers = require('./helpers');

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

// export it so we can start the site in start.js
module.exports = app;
