const {downloadUsersListBusiness,fetchUserProfileBusiness,fetchUserDetailsBusiness,addUserBusiness, getUserListBusiness, updateUserProfileBusiness} = require('../business-module/user-business-module/user-business');
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

router.get('/listUsers', async (req, res) => {
    let returnObj;
    returnObj = getUserListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get('/downloadUsers', async (req, res) => {
    let returnObj;
    returnObj = downloadUsersListBusiness(req);
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

router.get('/getUserDetails', async (req, res) => {
    let returnObj;
    returnObj = fetchUserDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;