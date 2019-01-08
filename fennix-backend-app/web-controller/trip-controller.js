var express = require('express');
var router = express.Router();
const tripBusiness = require('../business-module/trip-business-module/trip-business');

router.get('/listTripDetails', function (req, res) {
    let returnObj;
    returnObj = tripBusiness.fetchTripDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/startTrip', function (req, res) {
    let returnObj;
    returnObj = tripBusiness.startTripBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/endTrip', function (req, res) {
    let returnObj;
    returnObj = tripBusiness.endTripBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.get('/listCompletedTripDetails', function (req, res) {
    let returnObj;
    returnObj = tripBusiness.fetchCompletedTripDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
module.exports = router;