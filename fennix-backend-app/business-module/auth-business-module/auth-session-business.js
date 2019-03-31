const authDataAccessors = require('../../repository-module/data-accesors/user-session-accessor');
const jwt = require('jsonwebtoken');
const {JWTSecretPass} = require('../../util-module/util-constants/auth-constants');
const userLoginBusiness = async (req, authType, ip) => {
    return await authDataAccessors.generateUserTokenAccessor(req, authType, ip);
};

const userCookieTokenBusiness = async (req, authType, ip) => {
    return await authDataAccessors.generateCookieTokenAccessor(req, authType, ip);
};

const verifyUserSessionBusiness = async (req) => {
    return await authDataAccessors.verifyUserSessionAccessor(req.emailId, req.authToken);
};

const expireUserSessionBusiness = async (req) => {
    return await authDataAccessors.expireUserSessionAccessor(req.emailId, req.authToken);
};

const verifyAPISessionBusiness = async (req, res, next) => {
    let flag, returnFlag;
    const request = {emailId: '', authToken: req.header('Authorization')};
    request.authToken = request.authToken.replace('Bearer ', '');
    const decoded = jwt.verify(request.authToken, JWTSecretPass);
    console.log('decoded string');
    console.log(decoded);
    request.emailId = decoded && decoded.email_id ? decoded.email_id : '';
    returnFlag = await verifyUserSessionBusiness(request);
    if (returnFlag) {
        next();
    } else {
        res.status(401).send({error: 'authenticatioon failed'});
    }
};
module.exports = {
    userLoginBusiness,
    userCookieTokenBusiness,
    verifyUserSessionBusiness,
    expireUserSessionBusiness,
    verifyAPISessionBusiness
};
