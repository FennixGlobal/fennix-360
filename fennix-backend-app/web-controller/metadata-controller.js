var express = require('express');
const {getBaseMetadata,getCardMetadataForRoute} = require('../business-module/metadata-business-module/metadata-business');
var router = express.Router();

router.post('/baseMetadata', function (req, res) {
    let returnObj;
    returnObj = getBaseMetadata(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/cardMetadata',(req,res)=>{
    let returnObj;
    returnObj = getCardMetadataForRoute(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;