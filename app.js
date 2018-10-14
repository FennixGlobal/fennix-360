const {mongoDev, mongoLocal, mongoSofiaDev, mongoLab} = require('./fennix-backend-app/util-module/connection-constants');
const locationBusiness = require('./fennix-backend-app/business-module/location-business-module/location-business');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const socket = require('socket.io');
// const httpExpress = require('express');
// const http = require('http');
// const io = require('socket.io');
// const socketExpress = httpExpress();
// const server = http.createServer(socketExpress);
// const socketIO = io(server);
var bodyParser = require('body-parser');

const net = require('net');
const eNet = require('net');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoSofiaDev, {useNewUrlParser: true}).catch((err) => {
    console.log(err);
});

const TCPServer = net.createServer();
const ELockServer = eNet.createServer();

TCPServer.listen(3100);
ELockServer.listen(3150);

TCPServer.on("connection", (socket) => {
    console.log('IN TCP');
    socket.setEncoding('utf8');
    console.log('connected');
    socket.on('data', async (data) => {
        const returnValue = await locationBusiness.locationUpdateBusiness(data);
        console.log(returnValue);
        socket.write(returnValue);
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

ELockServer.on("connection", (socket) => {
    console.log('IN ELock TCP');
    socket.setEncoding('hex');
    socket.write('P01');
    console.log('connected');
    socket.on('data', async (data) => {
        const returnValue = await locationBusiness.eLocksDataUpdateBusiness(data);
        console.log(returnValue);
        if(returnValue){
        socket.write('P35');
        }
        console.log(data);
    });
    socket.on('error', (err) => {
        console.log('in elocks');
        console.log('error occurred');
        console.log(err);
    });
    socket.on('end', () => {
        console.log('end connection');
    });
    socket.on('close', (flag) => {
        console.log('socket closed due to error');
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
var containerRouter = require('./fennix-backend-app/web-controller/container-controller');
var liteUserRouter = require('./fennix-backend-app/web-controller/lite-user-controller');

var app = express();
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var whiteList = ['http://localhost:4200', 'http://sofiadev.fennix360.com:4200', '13.57.50.187:4200'];
// var checkOrigin = function(req.headers.origin){
//     // function (origin, callback) {
//         whiteList.indexOf(origin) !== -1
//         // callback(null, isWhitelisted);
//     // }
// };
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//     origin: 'http://sofiadev.fennix360.com:4200',
//     credentials: true
// };
//     function (origin, callback) {
//     if (whiteList.indexOf(origin) !== -1) {
//         callback(null, true)
//     } else {
//         callback(new Error('Not allowed by CORS'))
//     }
// }

// var corsOptions = {
//     origin: ,
//     credentials: true
// };
// corsOptions
app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (whiteList.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Credentials", 'true');
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
app.use('/container', containerRouter);
app.use('/lite', liteUserRouter);
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
