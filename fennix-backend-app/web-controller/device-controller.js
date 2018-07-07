const {deviceAggregatorDashboard,getDeviceByDeviceIdBusiness, listDevicesBusiness,listDeviceTypesBusiness,insertDeviceBusiness} = require('../business-module/device-business-module/device-business');
var express = require('express');
var router = express.Router();

router.get('/deviceAggregator', function (req, res) {
    let returnObj;
    returnObj = deviceAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listDeviceTypes', function (req, res) {
    let returnObj;
    returnObj = listDeviceTypesBusiness();
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listDevices', function (req, res) {
    let returnObj;
    returnObj = listDevicesBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/saveDevice', function (req, res) {
    let returnObj;
    returnObj = insertDeviceBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/getDeviceDetails', function (req, res) {
    let returnObj;
    returnObj = getDeviceByDeviceIdBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;