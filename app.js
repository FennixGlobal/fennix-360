const {mongoDev, mongoLocal} = require('./fennix-backend-app/util-module/connection-constants');
const locationBusiness = require('./fennix-backend-app/business-module/location-business-module/location-business');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var net = require('net');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoDev).catch((err) => {
    console.log(err);
});

var TCPServer = net.createServer();
TCPServer.listen(3100);
TCPServer.on("connection", (socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data) => {
        locationBusiness
        console.log('data is transmitted');
        console.log(data);
    });
    socket.on('error', (err) => {
        console.log('error occurred');
        console.log(err);
    });
    socket.on('end', () => {
        console.log('end connection');
    });
    socket.on('close', (flag) => {
        console.log(flag);
    });
});
var carrierRouter = require('./fennix-backend-app/web-controller/carrier-controller');
var simcardRouter = require('./fennix-backend-app/web-controller/simcard-controller');
var authRouter = require('./fennix-backend-app/web-controller/auth-controller');
var deviceRouter = require('./fennix-backend-app/web-controller/device-controller');
var userRouter = require('./fennix-backend-app/web-controller/user-controller');
var ticketRouter = require('./fennix-backend-app/web-controller/ticket-controller');
var metadataRouter = require('./fennix-backend-app/web-controller/metadata-controller');
var beneficiaryRouter = require('./fennix-backend-app/web-controller/beneficiary-controller');
var commonRouter = require('./fennix-backend-app/web-controller/common-controller');
var indexRouter = require('./routes/index');
var groupRouter = require('./fennix-backend-app/web-controller/group-controller');

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
app.use('/metadata', metadataRouter);
app.use('/ticket', ticketRouter);
app.use('/device', deviceRouter);
app.use('/beneficiary', beneficiaryRouter);
app.use('/common', commonRouter);
app.use('/carrier', carrierRouter);
app.use('/simcard', simcardRouter);
app.use('/group', groupRouter);
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
