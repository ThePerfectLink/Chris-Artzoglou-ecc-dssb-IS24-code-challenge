var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const ecc = require('./model/Ecc')
if(!fs.existsSync("./db.json")) {
  ecc.genEcc();
}

const pageRouter = require('./routes/pages');

const { error } = require('console');

var app = express();

// generate db if not present



// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "pug");
app.use(express.static(path.join('./public')));

app.use('/', pageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.data,
    error: err
  });
});

module.exports = app;
