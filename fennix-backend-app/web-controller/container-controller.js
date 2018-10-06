var express = require('express');
var router = express.Router();
const containerBusiness = require('../business-module/container-business-module/container-business');

router.get('/addContainer', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.addContainerDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;