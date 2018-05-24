var express = require('express');
const {beneficiaryMapDataList,beneficiaryAggregatorDashboard, beneficiaryListByOwnerUserId, beneficiaryLocationListByOwnerAndCenter} = require('../business-module/beneficiary-business-module/beneficiary-business');
var router = express.Router();

router.get('/beneficiaryAggregator', function (req, res) {
    let returnObj;
    returnObj = beneficiaryAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/beneficiaryListByOwner', function (req, res) {
    let returnObj;
    returnObj = beneficiaryListByOwnerUserId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/showMap', function (req, res) {
    let returnObj;
    returnObj = beneficiaryLocationListByOwnerAndCenter(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/beneficiaryListByOwner', function (req, res) {
    let returnObj;
    returnObj = beneficiaryListByOwnerUserId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/showMapGridData', function (req, res) {
    let returnObj;
    returnObj = beneficiaryMapDataList(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;