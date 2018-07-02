var express = require('express');
const {dropDownBusiness} = require('../business-module/metadata-business-module/metadata-business');
var router = express.Router();

router.get('/',function (req, res) {
    let returnObj;
    returnObj = dropDownBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});


module.exports = router;