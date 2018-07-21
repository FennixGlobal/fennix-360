const {dropDownBusiness} = require('../business-module/common-business-module/common-business');
var express = require('express');
var router = express.Router();

router.get('/dropdownData',function (req, res) {
    let returnObj;
    returnObj = dropDownBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});


module.exports = router;