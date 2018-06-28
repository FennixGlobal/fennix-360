var express = require('express');
const {beneficiaryMapDataList,addBeneficiaryBusiness, getBeneficiaryDetailsBusiness, beneficiaryAggregatorBusiness, beneficiaryListByOwnerUserId, beneficiaryLocationListByOwnerAndCenter} = require('../business-module/beneficiary-business-module/beneficiary-business');
var router = express.Router();

router.get('/beneficiaryAggregator', function (req, res) {
    let returnObj;
    returnObj = beneficiaryAggregatorBusiness(req);
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

router.get('/listBeneficiary', function (req, res) {
    let returnObj;
    returnObj = beneficiaryListByOwnerUserId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/addBeneficiary', function (req, res) {
    let returnObj;
    returnObj = addBeneficiaryBusiness(req);
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
router.get('/beneficiaryDetails', function (req, res) {
    let returnObj;
    returnObj = getBeneficiaryDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;