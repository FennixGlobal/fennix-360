var authAccesor = require('../../repository-module/data-accesors/auth-accesor');
const {emoji} = require('../../util-module/custom-request-reponse-modifiers/encoder-decoder-constants');
var crypto = require('crypto-js');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var checkEmailId = (req) => {
    let responseObj, businessResponse;
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const request = [
        decrypt(algo, passKey, req.body.email)
    ];
    businessResponse = authAccesor.checkUserEmailId(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_PRESENT, 'en', businessResponse.rows[0]);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_EMAIL_NOT_PRESENT, 'en', []);
    }
    return responseObj;
};

var authenticateUser = async (req) => {
    let responseObj, businessResponse;
    const algo = emoji[req.body.avatar]['encoding'];
    const passKey = emoji[req.body.avatar]['secretPass'];
    const request = [
        decrypt(algo, passKey, req.body.email),
        decrypt(algo, passKey, req.body.password)
    ];
    businessResponse = await authAccesor.authenticateUserDetails(request);
    if (objectHasPropertyCheck(businessResponse, 'rows') && arrayNotEmptyCheck(businessResponse.rows)) {
        if ((businessResponse.rows[0]['isactive'])) {
            responseObj = fennixResponse(statusCodeConstants.STATUS_USER_AUTHENTICATED, 'en', businessResponse.rows[0]);
        } else {
            responseObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', businessResponse.rows[0]);
        }
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_PASSWORD_INCORRECT, 'en', []);
    }
    return responseObj;
};
var decrypt = (algo, passKey, message) => {
    try {
        const decryptedBytes = crypto[algo]['decrypt'](message, passKey);
        return decryptedBytes.toString(crypto.enc.Utf8);
    } catch (e) {
        console.log(e);
    }
};
module.exports = {
    checkEmailId,
    authenticateUser
};