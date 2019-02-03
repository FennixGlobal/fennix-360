const crypto = require('crypto-js');
const bcrypt = require('bcryptjs');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {emoji} = require('../../util-module/custom-request-reponse-modifiers/encoder-decoder-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck, responseObjectCreator} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {checkUserEmailId, authenticateBeneficiaryDetails, authenticateUserDetails, checkBenificiaryEmailId} = require('../../repository-module/data-accesors/auth-accesor');
const {fetchUserDetailsBusiness, userResetPasswordBusiness} = require('../user-business-module/user-business');
const jwt = require('jsonwebtoken');
const {forgotPasswordemailBusiness} = require('../common-business-module/common-business');

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
    loginProfileResponse = await fetchUserDetailsBusiness(req);
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
    return responseObjectCreator(responseObj, ['role_name', 'user_role', 'first_name', 'last_name', 'user_id', 'owner_user_id', 'email_id', 'isactive', 'center_id'], ['role_name', 'user_role', 'first_name', 'last_name', 'user_id', 'owner_user_id', 'email_id', 'isactive', 'center_id']);
};

const forgotPasswordBusiness = async (req) => {
    let responseObj, businessResponse, retireCheckFlag, returnResponse = '';
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const emailId = decrypt(algo, passKey, req.body.email);
    const request = [
        decrypt(algo, passKey, req.body.email),
        req.body.language
    ];
    businessResponse = await authenticateUserDetails(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        retireCheckFlag = retireCheck(businessResponse.rows[0]);
        responseObj = responseFormation(businessResponse.rows[0], retireCheckFlag);
        if (retireCheckFlag) {
            forgotPasswordemailBusiness(emailId, `${businessResponse.rows[0]['first_name']} ${businessResponse.rows[0]['last_name']}`, businessResponse.rows[0]['user_role']);
        }
        returnResponse = responseObj;
    } else {
        businessResponse = await authenticateBeneficiaryDetails(request);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            responseObj = authResponseObjectFormation(businessResponse.rows[0]);
            retireCheckFlag = retireCheck(responseObj);
            responseObj = responseFormation(businessResponse.rows[0], retireCheckFlag);
            if (retireCheckFlag) {
                forgotPasswordemailBusiness(emailId, `${businessResponse.rows[0]['first_name']} ${businessResponse.rows[0]['last_name']}`, businessResponse.rows[0]['user_role']);
            }
            returnResponse = responseObj;
        } else {
            returnResponse = fennixResponse(statusCodeConstants.STATUS_NO_USER_FOR_ID, 'EN_US', []);
            // returnResponse.header = null;
            // returnResponse.response = responseObj;
        }

    }
    return returnResponse;
};
const resetPasswordBusiness = async (req) => {
    let responseObj, businessResponse, retireCheckFlag, returnResponse = '';
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    console.log('actual password');
    console.log(req.body.password);
    const emailId = decrypt(algo, passKey, req.body.email);
    const password = req.body.password;
    console.log('password change');
    console.log(password);
    const request = [
        emailId,
        req.body.language
    ];
    businessResponse = await authenticateUserDetails(request);
    // console.log(businessResponse);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        retireCheckFlag = retireCheck(businessResponse.rows[0]);
        responseObj = responseFormation(businessResponse.rows[0], retireCheckFlag);
        // console.log(retireCheckFlag);
        if (retireCheckFlag) {
            userResetPasswordBusiness(emailId, password);
        }
        returnResponse = responseObj;
    } else {
        businessResponse = await authenticateBeneficiaryDetails(request);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            responseObj = authResponseObjectFormation(businessResponse.rows[0]);
            retireCheckFlag = retireCheck(responseObj);
            responseObj = responseFormation(businessResponse.rows[0], retireCheckFlag);
            // if (retireCheckFlag) {
            //     forgotPasswordemailBusiness(emailId, `${businessResponse.rows[0]['first_name']} ${businessResponse.rows[0]['last_name']}`, businessResponse.rows[0]['user_role']);
            // }
            returnResponse = responseObj;
        } else {
            returnResponse = fennixResponse(statusCodeConstants.STATUS_NO_USER_FOR_ID, 'EN_US', []);
            // returnResponse.header = null;
            // returnResponse.response = responseObj;
        }

    }
    return returnResponse;
};

const responseFormation = (responseObj, retireCheck) => {
    return retireCheck ? fennixResponse(statusCodeConstants.STATUS_USER_AUTHENTICATED, 'EN_US', responseObj) : fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', responseObj)
};
module.exports = {
    checkEmailId,
    authenticateUser,
    resetPasswordBusiness,
    forgotPasswordBusiness,
    fetchLoginProfileBusiness
};