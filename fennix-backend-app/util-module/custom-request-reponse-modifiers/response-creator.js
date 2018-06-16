const {Client} = require('pg');
const {statusCodes} = require('../status-message-constants');
const {postgresDBDev} = require('../connection-constants');

const fennixResponse = (status, language, data) => {
    let returnObj = {};
    if (typeof status !== "number") {
        throw new Error('status must be a number');
    } else {
        returnObj = {
            status: status,
            userMessage: statusCodes[status]['userMsg'][language],
            devMessage: statusCodes[status]['devMsg'],
            data: data
        };
    }
    return returnObj;
};

const connectionCheckAndQueryExec = async (req, query) => {
    let returnObj;
    const postgresClient = new Client(postgresDBDev);
    await postgresClient.connect();
    returnObj = await postgresClient.query(query, req);
    await postgresClient.end();
    return returnObj;
};

const dropdownCreator = (dropdownKey, dropdownValue, isDisabledFlag) => {
    return {dropdownKey, dropdownValue, isDisabledFlag}
};

// const createGridResponse = (primaryValue, secondaryValue, hoverValue, key, role, gender) => {
//     let response = {
//         primaryValue: primaryValue,
//         secondaryValue: secondaryValue,
//         hoverValue: hoverValue,
//         key: key,
//         role: role,
//         gender: gender
//     };
//     return response;
// };

module.exports = {
    connectionCheckAndQueryExec,
    fennixResponse,
    dropdownCreator,
    // createGridResponse
};