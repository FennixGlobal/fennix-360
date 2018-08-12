var express = require('express');
var router = express.Router();
const beneficiaryBusiness = require('../business-module/beneficiary-business-module/beneficiary-business');

router.get('/listBeneficiariesForAddTicket', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.listBeneficiariesForAddTicketBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/beneficiaryAggregator', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.beneficiaryAggregatorBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/beneficiaryListByOwner', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.beneficiaryListByOwnerUserId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/showMap', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.beneficiaryLocationListByOwnerAndCenter(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listBeneficiary', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.beneficiaryListByOwnerUserId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/downloadBeneficiaries', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.downloadBeneficiariesBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/addBeneficiary', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.addBeneficiaryBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/showMapGridData', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.beneficiaryMapDataList(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/getBeneficiaryDetails', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.getBeneficiaryDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/getCompleteBeneficiaryDetailsByBenId', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.getAllBeneficiaryDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.post('/updateBeneficiary', function (req, res) {
    let returnObj;
    returnObj = beneficiaryBusiness.updateBeneficiaryBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
module.exports = router;