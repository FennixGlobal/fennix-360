var express = require('express');
const {getModelMetadataBusiness,getLanguageListGridBusiness,getRolesForRoleIdBusiness,getFilterMetadataBusiness,getBaseMetadataBusiness,getCardMetadataForRouteBusiness,getLanguagesListBusiness,getSimCardDetailsBusiness,getLoginMetadataBusiness, getRolesBusiness } = require('../business-module/metadata-business-module/metadata-business');
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

router.get('/modalMetadata', function (req, res) {
    let returnObj;
    returnObj = getModelMetadataBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/roles', function (req, res) {
    let returnObj;
    returnObj = getRolesBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});


router.get('/cardFilters', function (req, res) {
    let returnObj;
    returnObj = getFilterMetadataBusiness(req, 'roleCardId');
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/widgetFilters', function (req, res) {
    let returnObj;
    returnObj = getFilterMetadataBusiness(req, 'roleCardWidgetId');
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/pageFilters', function (req, res) {
    let returnObj;
    returnObj = getFilterMetadataBusiness(req, 'routeId');
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/getRolesForRoleId', function (req, res) {
    let returnObj;
    returnObj = getRolesForRoleIdBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listLanguagesGrid', function (req, res) {
    let returnObj;
    returnObj = getLanguageListGridBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;