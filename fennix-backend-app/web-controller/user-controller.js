const {fetchUserProfileBusiness, getUserListBusiness, updateUserProfileBusiness} = require('../business-module/user-business-module/user-business');
const express = require('express');
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


// Exposing Functions

// const userController = {
//     fetchUserProfile: (async (req) => {
//         let businessPromise, returnObj = {};
//         businessPromise = fetchUserProfileBusiness(req);
//         await businessPromise.then((response) => {
//             returnObj = response;
//         });
//         return returnObj;
//     }),
//     updateUserProfile: (async (req) => {
//         let businessPromise, returnObj = {};
//         businessPromise = updateUserProfileBusiness(req);
//         await businessPromise.then((response) => {
//             returnObj = response;
//         });
//         return returnObj;
//     }),
// };


module.exports = router;