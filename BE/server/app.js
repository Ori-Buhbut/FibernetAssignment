var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
const morgan = require('morgan')
const fs = require('fs');
var indexRouter = require('./routes/index');
var tasksRouter = require('./routes/tasks');
const io = require('socket.io');

var app = express();
app.use(morgan('dev'));
app.use(morgan('common', {
  stream: fs.createWriteStream(`./logs/http.log`, {flags: 'a'})
}));

app.set('socketio', io);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/tasks', tasksRouter);
// error handler
app.use(function(err, req, res, next) {
  res.json({success: false, message: err.toString()});
});
module.exports = app;
