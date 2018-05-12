const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'pug');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

// export it so we can start the site in start.js
module.exports = app;
