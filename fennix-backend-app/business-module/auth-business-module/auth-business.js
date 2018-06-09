const {emoji} = require('../../util-module/custom-request-reponse-modifiers/encoder-decoder-constants');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const crypto = require('crypto-js');
const bcrypt = require('bcryptjs');
const {checkUserEmailId,authenticateBeneficiaryDetails,authenticateUserDetails,checkBenificiaryEmailId} = require('../../repository-module/data-accesors/auth-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');

const checkEmailId = (req) => {
    let responseObj, businessResponse;
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const request = [
        decrypt(algo, passKey, req.body.email)
    ];
    businessResponse = checkUserEmailId(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_PRESENT, 'en', businessResponse.rows[0]);
    } else {
        businessResponse = checkBenificiaryEmailId(request);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_PRESENT, 'en', businessResponse.rows[0]);
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_NOT_PRESENT, 'en', []);
        }
    }
    return responseObj;
};

const authenticateUser = async (req) => {
    let responseObj, businessResponse, authResponse;
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const request = [
        decrypt(algo, passKey, req.body.email)
    ];
    businessResponse = await authenticateUserDetails(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        authResponse = await bcrypt.compare(decrypt(algo, passKey, req.body.password), businessResponse.rows[0].password);
        if (authResponse) {
            responseObj = retireCheck(businessResponse.rows);
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'en', []);
        }

    } else {
        businessResponse = await authenticateBeneficiaryDetails(request);
        if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
            authResponse = await bcrypt.compare(decrypt(algo, passKey, req.body.password), businessResponse.rows[0].password);
            if (authResponse) {
                responseObj = retireCheck(businessResponse.rows);
            } else {
                responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'en', []);
            }
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'en', []);
        }
    }
    return responseObj;
};
const decrypt = (algo, passKey, message) => {
    try {
        const decryptedBytes = crypto[algo]['decrypt'](message, passKey);
        return decryptedBytes.toString(crypto.enc.Utf8);
    } catch (e) {
        console.log(e);
    }
};

const retireCheck = (responseArray) => (responseArray[0]['isactive']) ? fennixResponse(statusCodeConstants.STATUS_USER_AUTHENTICATED, 'en', responseArray[0]) : fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', responseArray[0]);

module.exports = {
    checkEmailId,
    authenticateUser
};