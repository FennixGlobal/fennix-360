const {Client} = require('pg');
const {statusCodes} = require('../status-message-constants');
const {postgresDBDev, postgresDBLocal} = require('../connection-constants');

const fennixResponse = (status, language, data) => {
    let returnObj = {};
    if (typeof status !== "number") {
        throw new Error('status must be a number');
    } else {
        returnObj = {
            responseStatus: status,
            userMessage: statusCodes[status]['userMsg'][language],
            devMessage: statusCodes[status]['devMsg'],
            responseData: data
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

const dropdownActionButtonCreator = (dropdownActionButton) => {
    let dropdownAction = {
        dropdownKey: dropdownActionButton['dropdown_key'],
        dropdownId: dropdownActionButton['dropdown_id'],
        dropdownValue: dropdownActionButton['dropdown_value'],
        isDisabledFlag: dropdownActionButton['is_disable'],
        dropdownIconKey: dropdownActionButton['dropdown_action_button_icon_key'],
        dropdownIconValue: dropdownActionButton['dropdown_action_button_icon_value']
    };
    // };
    if (dropdownActionButton['is_action_button']) {
        dropdownAction = {
            ...dropdownAction,
            actionType: dropdownActionButton['action_name'],
            submitEndpoint: dropdownActionButton['endpoint'],
            subReqType: dropdownActionButton['endpoint_request_type'],
            subReqParams: dropdownActionButton['endpoint_mandatory_request_params'],
            navigationRouteName: dropdownActionButton['route_name'],
            navigationRouteUrl: dropdownActionButton['route_url'],
            navigationRouteId: dropdownActionButton['route_id']
        }
    }
    return dropdownAction;
};

module.exports = {
    connectionCheckAndQueryExec,
    fennixResponse,
    dropdownCreator,
    dropdownActionButtonCreator
};