var express = require('express');
const {getBaseMetadataBusiness,getCardMetadataForRouteBusiness,getLanguagesListBusiness,getSimCardDetailsBusiness,getLoginMetadataBusiness } = require('../business-module/metadata-business-module/metadata-business');
var router = express.Router();

router.post('/baseMetadata', function (req, res) {
    let returnObj;
    returnObj = getBaseMetadataBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/cardMetadata',(req,res)=>{
    let returnObj;
    returnObj = getCardMetadataForRouteBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/simCardDetails', (req, res) => {
    let returnObj;
    returnObj = getSimCardDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listLanguages', function (req, res) {
    let returnObj;
    returnObj = getLanguagesListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/loginMetadata', function (req, res) {
    let returnObj;
    returnObj = getLoginMetadataBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});


module.exports = router;