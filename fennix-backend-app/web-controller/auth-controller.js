var express = require('express');
var router = express.Router();
var authBusiness = require('../business-module/auth-business-module/auth-business');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../util-module/data-validators');
var app = express();

/* GET home page. */
router.post('/authenticate', function (req, res) {
    var returnObj = authBusiness.authenticateUser(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/checkEmail', function (req, res) {
    var returnObj = authBusiness.checkEmailId(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;