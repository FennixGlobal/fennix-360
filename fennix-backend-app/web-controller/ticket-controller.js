var express = require('express');
const {listTicketsBusiness,ticketAggregatorBusiness,ticketListBasedOnStatusBusiness} = require('../business-module/ticket-business-module/ticket-business');
var router = express.Router();

router.get('/ticketAggregator', function (req, res) {
    let returnObj;
    returnObj = ticketAggregatorBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/ticketDetails', function (req, res) {
    let returnObj;
    returnObj = ticketListBasedOnStatusBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    });
});

router.get('/listTickets', function (req, res) {
    let returnObj;
    returnObj = listTicketsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    });
});
module.exports = router;