const eLockSessionAccessors = require('../../repository-module/data-accesors/e-lock-session-accessor');

const insertELockSessionBusiness = async (req, deviceId) => {
    let request = {}, sessionInsertResponse;
    request = {
        eLockId: parseInt(deviceId, 10),
        connectingIPAddress: req.ipAddress,
        connectingPort: req.socketPort,
        connectingSocket: req.socketKey,
        lastConnectionTime: new Date(),
        initialConnectionTime: new Date()
    };
    sessionInsertResponse = await eLockSessionAccessors.insertELockSessionAccessor(request);
    return sessionInsertResponse;
};

const getELockSessionBusiness = async (deviceId) => {
    const request = {eLockId: deviceId};
    let sessionResponse, elockSessionFinalResponse = null;
    sessionResponse = await eLockSessionAccessors.getELockSessionAccessor(request);
    console.log(sessionResponse);
    if (sessionResponse && sessionResponse.length > 0) {
        elockSessionFinalResponse = sessionResponse;
    }
    return elockSessionFinalResponse;
};
module.exports = {
    insertELockSessionBusiness,
    getELockSessionBusiness
};