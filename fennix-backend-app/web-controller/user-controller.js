var express = require('express');
// var userRepository = require('../repository-module/data-accesors/user-accesor');
var dataValidator = require('../util-module/data-validators');
var router = express.Router();
router.post('/fetchProfile', async (req, res) => {
    let returnObj;
    returnObj = deviceAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.post('/updateProfile', async (req, res) => {
    let returnObj;
    returnObj = deviceAggregatorDashboard(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;