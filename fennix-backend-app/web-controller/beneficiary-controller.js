var express = require('express');
const {beneficiaryAggregatorDashboard} = require('../business-module/beneficiary-business-module/beneficiary-business');
var router = express.Router();

router.get('/beneficiaryAggregator', function (req, res) {
    let returnObj;
    returnObj = beneficiaryAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;