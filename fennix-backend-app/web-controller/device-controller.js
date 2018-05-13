var express = require('express');
const {deviceAggregatorDashboard} = require('../business-module/device-business-module/device-business');
var router = express.Router();

router.get('/deviceAggregator', function (req, res) {
    let returnObj;
    returnObj = deviceAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;