var express = require('express');
var router = express.Router();
const routeBusiness = require('../business-module/route-business-module/route-business');

router.get('/getCompanyRoutes', (req, res) => {
    let returnObj;
    returnObj = routeBusiness.getRouteByCompanyIdBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;
