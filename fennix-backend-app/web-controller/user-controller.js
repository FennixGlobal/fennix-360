const {fetchUserProfileBusiness,addUserBusiness, getUserListBusiness, updateUserProfileBusiness} = require('../business-module/user-business-module/user-business');
const express = require('express');
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

router.post('/addUser', async (req, res) => {
    let returnObj;
    returnObj = addUserBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
module.exports = router;