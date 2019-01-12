const crypto = require('crypto-js');
const bcrypt = require('bcryptjs');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {emoji} = require('../../util-module/custom-request-reponse-modifiers/encoder-decoder-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {checkUserEmailId, authenticateBeneficiaryDetails, authenticateUserDetails, checkBenificiaryEmailId} = require('../../repository-module/data-accesors/auth-accesor');
const {fetchUserDetailsBusiness} = require('../user-business-module/user-business');
const jwt = require('jsonwebtoken');

const checkEmailId = async (req) => {
    let responseObj, businessResponse;
    // const algo = emoji[req.query.avatar]['encoding'];
    // const passKey = emoji[req.query.avatar]['secretPass'];
    // const request = [
    //     decrypt(algo, passKey, req.query.email)
    // ];
    businessResponse = await checkUserEmailId([req.query.userMailId]);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_PRESENT, 'EN_US', businessResponse.rows[0]);
    } else {
        businessResponse = checkBenificiaryEmailId(req.query.email);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_PRESENT, 'EN_US', businessResponse.rows[0]);
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_NOT_PRESENT, 'EN_US', []);
        }
    }
    return responseObj;
};

const fetchLoginProfileBusiness = async (req) => {
    let loginProfileResponse;
    // if (req.query.userRoleId > 2) {
    loginProfileResponse = await fetchUserDetailsBusiness(req);
    // userController
    // await router.get('user/fetchProfile', function (req, res) {
    //     const returnObj = res;
    //     returnObj.then((response) => {
    //         loginProfileResponse = response;
    //     });
    // })
    // } else {
    // await router.get('beneficiary/fetchBeneficiaryProfile', function (req, res) {
    //     const returnObj = res;
    //     returnObj.then((response) => {
    //         loginProfileResponse = response;
    //     });
    // })
    // }
    return loginProfileResponse;
};

const authenticateUser = async (req) => {
    let responseObj, businessResponse, authResponse, retireCheckFlag, returnResponse = {response: null, header: null};
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const request = [
        decrypt(algo, passKey, req.body.email),
        req.body.language
    ];
    businessResponse = await authenticateUserDetails(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        authResponse = await bcrypt.compare(decrypt(algo, passKey, req.body.password), businessResponse.rows[0].password);
        if (authResponse) {
            responseObj = authResponseObjectFormation(businessResponse.rows[0]);
            retireCheckFlag = retireCheck(responseObj);
            responseObj = responseFormation(responseObj, retireCheckFlag);
            returnResponse.header = retireCheckFlag ? jwt.sign(responseObj, 'SOFIA-Fennix Global') : null;
            returnResponse.response = responseObj;
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'EN_US', []);
            returnResponse.header = null;
            returnResponse.response = responseObj;
        }
    } else {
        businessResponse = await authenticateBeneficiaryDetails(request);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            authResponse = await bcrypt.compare(decrypt(algo, passKey, req.body.password), businessResponse.rows[0].password);
            if (authResponse) {
                responseObj = authResponseObjectFormation(businessResponse.rows[0]);
                retireCheckFlag = retireCheck(responseObj);
                responseObj = responseFormation(responseObj, retireCheckFlag);
                returnResponse.header = retireCheckFlag ? jwt.sign(responseObj, 'SOFIA-Fennix Global') : null;
                returnResponse.response = responseObj;
            } else {
                responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'EN_US', []);
                returnResponse.header = null;
                returnResponse.response = responseObj;
            }
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'EN_US', []);
            returnResponse.header = null;
            returnResponse.response = responseObj;
        }
    }
    return returnResponse;
};

const decrypt = (algo, passKey, message) => {
    try {
        const decryptedBytes = crypto[algo]['decrypt'](message, passKey);
        return decryptedBytes.toString(crypto.enc.Utf8);
    } catch (e) {
        console.log(e);
    }
};

const retireCheck = (responseObj) => (responseObj['isactive']);

const authResponseObjectFormation = (responseObj) => {
    return {
        role_name: responseObj['role_name'],
        user_role: responseObj['user_role'],
        first_name: responseObj['first_name'],
        last_name: responseObj['last_name'],
        user_id: responseObj['user_id'],
        owner_user_id: responseObj['owner_user_id'],
        email_id: responseObj['email_id'],
        isactive: responseObj['isactive'],
        center_id: responseObj['center_id']
    }
};

const responseFormation = (responseObj, retireCheck) => {
    return retireCheck ? fennixResponse(statusCodeConstants.STATUS_USER_AUTHENTICATED, 'EN_US', responseObj) : fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', responseObj)
};
module.exports = {
    checkEmailId,
    authenticateUser,
    fetchLoginProfileBusiness
};