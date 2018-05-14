var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/fennixDevDb');

var indexRouter = require('./routes/index');
var authRouter = require('./fennix-backend-app/web-controller/auth-controller');
var deviceRouter = require('./fennix-backend-app/web-controller/device-controller');
var userRouter = require('./fennix-backend-app/web-controller/user-controller');
var ticketRouter = require('./fennix-backend-app/web-controller/ticket-controller');
var metadataRouter = require('./fennix-backend-app/web-controller/metadata-controller');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/metadata',metadataRouter);
app.use('/ticket',ticketRouter);
app.use('/device',deviceRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render('index');
    // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});

module.exports = app;
