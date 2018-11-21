const {Client} = require('pg');
const {statusCodes} = require('../status-message-constants');
const {postgresDBDev, postgresDBLocal, postgresSofiaDev} = require('../connection-constants');
const postgresClient = new Client(postgresSofiaDev);

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
        dropdownSetId: dropdownActionButton['dropdown_set_id'],
        dropdownKey: dropdownActionButton['dropdown_key'],
        dropdownId: dropdownActionButton['dropdown_id'],
        dropdownValue: dropdownActionButton['dropdown_value'],
        isDisabledFlag: dropdownActionButton['is_disable'],
        dropdownTransferKey: dropdownActionButton['dropdown_transfer_key'],
        dropdownIconKey: dropdownActionButton['dropdown_action_button_icon_key'],
        dropdownIconValue: dropdownActionButton['dropdown_action_button_icon_value']
    };
    if (dropdownActionButton['is_action_button']) {
        dropdownAction = {
            ...dropdownAction,
            modalId: dropdownActionButton['dropdown_action_button_modal_id'],
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