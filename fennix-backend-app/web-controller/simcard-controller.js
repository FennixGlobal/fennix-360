const {listUnAssignedSimcardsBusiness, listSimcardTypesBusiness} = require('../business-module/simcard-business-module/simcard-business');
var express = require('express');
var router = express.Router();

router.get('/listUnAssignedSimcards', function (req, res) {
    let returnObj;
    returnObj = listUnAssignedSimcardsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listSimcardTypes', function (req, res) {
    let returnObj;
    returnObj = listSimcardTypesBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;