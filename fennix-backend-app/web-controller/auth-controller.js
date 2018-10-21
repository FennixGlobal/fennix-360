const express = require('express');
const router = express.Router();
const authBusiness = require('../business-module/auth-business-module/auth-business');

/* GET home page. */
router.post('/authenticate', function (req, res) {
    var returnObj = authBusiness.authenticateUser(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/fetchLoginProfile', function (req, res) {
    var returnObj = authBusiness.fetchLoginProfileBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/updateLoginProfile', function (req, res) {
    var returnObj = authBusiness.authenticateUser(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/checkEmailId', function (req, res) {
    var returnObj = authBusiness.checkEmailId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;