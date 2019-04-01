const userBusiness = require('../business-module/user-business-module/user-business');
const {verifyAPISessionBusiness} = require('../business-module/auth-business-module/auth-session-business');
const express = require('express');
const {USER_CONTROLLER} = require('../util-module/util-constants/fennix-controller-constants');
const router = express.Router();

router.get(USER_CONTROLLER.USER_FETCH_USER_PROFILE, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.fetchUserDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.post(USER_CONTROLLER.USER_UPDATE_USER_PROFILE, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.updateUserProfileBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_GET_USER_LIST, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.getUserListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_DOWNLOAD_USER, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.downloadUsersListBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_LIST_OPERATORS, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.listOperatorsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post(USER_CONTROLLER.USER_ADD_USER, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.addUserBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_GET_USER_DETAILS, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.fetchUserDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.post(USER_CONTROLLER.USER_UPDATE_USER, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.updateUserBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_DELETE_USER, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.deleteUserBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});
router.get(USER_CONTROLLER.USER_LIST_UNASSIGNED_CLIENTS, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.listUnassignedClientsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

router.get(USER_CONTROLLER.USER_LIST_CLIENTS_BY_COMPANY_ID, verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.listClientsByCompanyIdBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});


router.get('/getAllUserDetails', verifyAPISessionBusiness, async (req, res) => {
    let returnObj;
    returnObj = userBusiness.fetchAllUserDetailsBusiness(req);
    returnObj.then((response) => {
        res.send(response);
    })
});

module.exports = router;
