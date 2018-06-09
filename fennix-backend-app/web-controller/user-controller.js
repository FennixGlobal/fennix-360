const express = require('express');
const {fetchUserProfileBusiness,getUserListBusiness,updateUserProfileBusiness} = require('../business-module/user-business-module/user-business');
const dataValidator = require('../util-module/data-validators');
const router = express.Router();
router.get('/fetchProfile', async (req, res) => {
    let returnObj;
    returnObj = fetchUserProfileBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.post('/updateProfile', async (req, res) => {
    let returnObj;
    returnObj = updateUserProfileBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post('/listUsers', async (req, res) => {
    let returnObj;
    returnObj = getUserListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;