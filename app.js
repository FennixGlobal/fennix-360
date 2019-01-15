const {mongoDev, mongoLocal, mongoSofiaDev, mongoLab} = require('./fennix-backend-app/util-module/connection-constants');
const locationBusiness = require('./fennix-backend-app/business-module/location-business-module/location-business');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const socket = require('socket.io');
const httpExpress = require('express');
const http = require('http');
const io = require('socket.io');
const socketExpress = httpExpress();
const server = http.createServer(socketExpress);
server.listen(3150);
const socketIO = io(server);
var bodyParser = require('body-parser');
module.exports.socket = {socketIO};
const net = require('net');
// const eNet = require('net');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoSofiaDev, {useNewUrlParser: true}).catch((err) => {
    console.log(err);
});

const TCPServer = net.createServer();
socketIO.on('connection', (sock) => {
    let responseData;
    console.log('connected to elock');
    sock.on('elock_data', async (newSockData) => {
        console.log(newSockData);
        // responseData = await locationBusiness.eLocksDataUpdateDumpBusiness(newSockData);
        responseData = await locationBusiness.eLocksDataUpdateBusiness(newSockData);
        if (responseData !== null && responseData !== undefined && responseData !== '') {
            socketIO.emit('server_data', responseData);
        }
    })
});
// const ELockServer = eNet.createServer();

TCPServer.listen(3100);
// ELockServer.listen(3150);
const benSocket = {};
TCPServer.on("connection", (socket) => {
    console.log('IN TCP');
    socket.setEncoding('utf8');
    console.log('connected');
    const socketKey = `${socket.remoteAddress}:${socket.remotePort}`;
    socket.on('data', async (data) => {
        if (benSocket && socket && socketKey && !benSocket.hasOwnProperty(socketKey)) {
            benSocket[socketKey] = socket;
        }
        const returnValue = await locationBusiness.locationUpdateBusiness(data, socketKey);
        if (returnValue.data) {
            benSocket[returnValue.socketKey].write(returnValue.data);
        }
    });
    socket.on('error', (err) => {
        console.log('error occurred');
        console.log(err);
    });
    socket.on('end', () => {
        console.log('end connection');
    });
    socket.on('close', (flag) => {
        console.log('closing the socket');
        console.log(flag);
    });
    socket.on('lookup', (lookupdata) => {
        console.log('lock up data');
        console.log(lookupdata);
    });
});

// metadata related controller
const commonRouter = require('./fennix-backend-app/web-controller/common-controller');
const metadataRouter = require('./fennix-backend-app/web-controller/metadata-controller');

//beneficiary controller
const userRouter = require('./fennix-backend-app/web-controller/user-controller');
const beneficiaryRouter = require('./fennix-backend-app/web-controller/beneficiary-controller');
const groupRouter = require('./fennix-backend-app/web-controller/group-controller');

// E - Locks controller
const containerRouter = require('./fennix-backend-app/web-controller/container-controller');
const tripRouter = require('./fennix-backend-app/web-controller/trip-controller');
const companyRouter = require('./fennix-backend-app/web-controller/company-controller');
const routeRouter = require('./fennix-backend-app/web-controller/route-controller');
// Lite controllers
const liteUserRouter = require('./fennix-backend-app/web-controller/lite-user-controller');
const liteTicketRouter = require('./fennix-backend-app/web-controller/lite-ticket-controller');
const liteDeviceRouter = require('./fennix-backend-app/web-controller/lite-device-controller');
const liteUserTrackingRouter = require('./fennix-backend-app/web-controller/lite-user-tracking-controller');

// Common Controllers
const carrierRouter = require('./fennix-backend-app/web-controller/carrier-controller');
const simcardRouter = require('./fennix-backend-app/web-controller/simcard-controller');
const authRouter = require('./fennix-backend-app/web-controller/auth-controller');
const deviceRouter = require('./fennix-backend-app/web-controller/device-controller');
const ticketRouter = require('./fennix-backend-app/web-controller/ticket-controller');

const indexRouter = require('./routes/index');

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
app.use('/company', companyRouter);
app.use('/trip', tripRouter);
app.use('/carrier', carrierRouter);
app.use('/simcard', simcardRouter);
app.use('/group', groupRouter);
app.use('/container', containerRouter);
app.use('/route', routeRouter);
app.use('/lite', [liteUserRouter, liteTicketRouter, liteDeviceRouter, liteUserTrackingRouter]);
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
