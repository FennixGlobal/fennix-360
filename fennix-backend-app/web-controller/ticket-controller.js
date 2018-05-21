var express = require('express');
const {ticketAggregatorDashboard, ticketDetails} = require('../business-module/ticket-business-module/ticket-business');
var router = express.Router();

router.get('/ticketAggregator', function (req, res) {
    let returnObj;
    returnObj = ticketAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/ticketDetails', function (req, res) {
    let returnObj;
    returnObj = ticketDetails(req);
    returnObj.then((response) => {
        res.send(response);
    });

});
module.exports = router;