var express = require('express');
const {deviceAggregatorDashboard, listDevicesBusiness} = require('../business-module/device-business-module/device-business');
var router = express.Router();

router.get('/deviceAggregator', function (req, res) {
    let returnObj;
    returnObj = deviceAggregatorDashboard(req);
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

module.exports = router;