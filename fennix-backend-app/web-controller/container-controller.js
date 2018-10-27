var express = require('express');
var router = express.Router();
const locationBusiness = require('../business-module/location-business-module/location-business');
const containerBusiness = require('../business-module/container-business-module/container-business');
const deviceBusiness = require('../business-module/device-business-module/device-business');

router.post('/addContainer', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.addContainerDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listContainer', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.listContainerBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.get('/deactivateContainer', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.deactivateContainerBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.post('/assignElock', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.assignContainerBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/delinkContainer', function (req, res) {
    let returnObj;
    returnObj = deviceBusiness.unlinkDeviceForContainerBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/listUnAssignedContainer', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.listUnassignedContainerBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/showContainerMap', function (req, res) {
    let returnObj;
    returnObj = containerBusiness.containerMapDataListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.get('/listUnAssignedELocks', function (req, res) {
    let returnObj;
    returnObj = deviceBusiness.listUnAssignedDevicesForContainerBusiness();
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/fetchELocksData', function (req, res) {
    let returnObj;
    console.log('data in container');
    console.log(req.body);
    returnObj = locationBusiness.eLocksDataUpdateBusiness(req.body['data']);
    // returnObj = deviceBusiness.listUnAssignedDevicesForContainerBusiness();
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;