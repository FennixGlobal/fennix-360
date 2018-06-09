const {notNullCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {fetchUserProfileAccesor, getUserListAccesor, updateUserProfileAccesor} = require('../../repository-module/data-accesors/user-accesor');

var fetchUserProfileBusiness = async (req) => {
    let request = [req.query.userId], userProfileResponse, returnObj;
    userProfileResponse = await fetchUserProfileAccesor(request);
    if (notNullCheck(userProfileResponse) && arrayNotEmptyCheck(userProfileResponse)) {
        let ticketObj = {};
        userProfileResponse.forEach((item) => {
            ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
//TODO write the logic for this
const updateUserProfileBusiness = async (req) => {
    let request = [req.body.userId], userProfileResponse, returnObj;
    userProfileResponse = await updateUserProfileAccesor(request);
    if (notNullCheck(userProfileResponse) && arrayNotEmptyCheck(userProfileResponse)) {
        let ticketObj = {};
        userProfileResponse.forEach((item) => {
            ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

const getUserListBusiness = async (req) => {
    let request = [req.body.userId], userProfileResponse, returnObj;
    userProfileResponse = await getUserListAccesor(request);
    if (notNullCheck(userProfileResponse) && arrayNotEmptyCheck(userProfileResponse)) {
        let ticketObj = {};
        userProfileResponse.forEach((item) => {
            ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

module.exports = {
    fetchUserProfileBusiness,
    updateUserProfileBusiness,
    getUserListBusiness
};
