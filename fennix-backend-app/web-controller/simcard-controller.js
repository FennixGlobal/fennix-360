const {listSimcardsBusiness} = require('../business-module/simcard-business-module/simcard-business');
var express = require('express');
var router = express.Router();

router.get('/listSimcards', function (req, res) {
    let returnObj;
    returnObj = listSimcardsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;