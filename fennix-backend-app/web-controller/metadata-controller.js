var express = require('express');
const {getCountryListBusiness,listCentersBusiness,getModelMetadataBusiness,getSimCardListBusiness,getLanguageListGridBusiness,getRolesForAdminBusiness, getRolesForNonAdminsBusiness,getFilterMetadataBusiness,getBaseMetadataBusiness,getCardMetadataForRouteBusiness,getLanguagesListBusiness,getSimCardDetailsBusiness,getLoginMetadataBusiness, getRolesBusiness } = require('../business-module/metadata-business-module/metadata-business');
var router = express.Router();

router.get('/listCenters', function (req, res) {
    let returnObj;
    returnObj = listCentersBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.get('/listCountries', function (req, res) {
    let returnObj;
    returnObj = getCountryListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
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

router.get('/getRolesForAdmin', function (req, res) {
    let returnObj;
    returnObj = getRolesForAdminBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/getRolesForNonAdmin', function (req, res) {
    let returnObj;
    returnObj = getRolesForNonAdminsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listSimCards', (req, res) => {
    let returnObj;
    returnObj = getSimCardListBusiness(req);
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