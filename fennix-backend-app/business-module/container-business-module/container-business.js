const containerAccessors = require('../../repository-module/data-accesors/container-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck} = require('../../util-module/data-validators');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const deviceAccessors = require('../../repository-module/data-accesors/device-accesor');

const addContainerDetailsBusiness = async (req) => {
    let request = req.body;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    await containerAccessors.addContainerDetailsAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_CONTAINER_ADDED_SUCCESS, 'EN_US', []);
};

const listContainerBusiness =async() => {
    let returnObj, totalNoOfRecords, finalResponse = {}, containerListResponse, containerIds = [], finalReturnObj = {};
    containerListResponse = await containerAccessors.listContainersAccessor();
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersAccessor();
    finalResponse['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        containerListResponse.rows.forEach(item => {
            finalReturnObj[item['container_id']] = {
                documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
                containerId: item['container_id'],
                containerType: item['container_type'],
                containerName: item['container_name'],
                image: item['container_image']
            };
            containerIds.push(item['container_id']);
        });
        let deviceDetailsResponse = await deviceAccessors.getDeviceDetailsForListOfContainersAccessor(containerIds);
        if (arrayNotEmptyCheck(deviceDetailsResponse)) {
            deviceDetailsResponse.forEach(device => {
                finalReturnObj[device['containerId']] = {
                    ...finalReturnObj[device['beneficiaryId']],
                    deviceId: device['_id'],
                    imei: objectHasPropertyCheck(device, 'imei') && notNullCheck(device['imei']) ? device['imei'] : '999999999',
                    deviceType: objectHasPropertyCheck(device, 'deviceType') && arrayNotEmptyCheck(device['deviceType']) ? device['deviceType'][0]['name'] : 'No Device Type'
                };
            });
        }
        finalResponse['gridData'] = Object.keys(finalReturnObj).map(key => finalReturnObj[key]);
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const listUnassignedContainerBusiness =async() => {
    let response, modifiedResponse = [], finalResponse;
    response = await containerAccessors.listUnAssignedContainersAccessor([]);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                id: item['container_id'],
                primaryValue: {text: 'Container Name', value: item['container_name']}
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const deactivateContainerBusiness = async(req) => {
    let request = {containerId: req.query.containerId, isActive: false}, response, finalResponse;
    request['endDate'] = new Date();
    request['deactivatedBy'] = req.query.userId;
    response = await containerAccessors.updateContainerAccessor(request);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_BENEFICIARY_DEACTIVATE_SUCCESS, 'EN_US', 'Deleted container data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'EN_US', '');
    }
    return finalResponse;
};

const assignContainerBusiness =async(req) => {
    let request, finalResponse;
    req.body.startDate = new Date();
    req.body.deviceAssignedBy = req.body.userId;
    await containerAccessors.updateContainerAccessor(req.body);
    request = {
        containerId: parseInt(req.body.containerId, 10),
        deviceId: parseInt(req.body.deviceId, 10)
    };
    await deviceAccessors.updateDeviceWithContainerIdAccessor(request);
    finalResponse = fennixResponse(statusCodeConstants.STATUS_DEVICE_ADD_SUCCESS, 'EN_US', 'Updated container data successfully');
    return finalResponse;
};

// const delinkContainerBusiness = async() => {
//
// };

// const listUnassignedELocksBusiness = async() => {
//
// };


module.exports = {
    addContainerDetailsBusiness,
    assignContainerBusiness,
    deactivateContainerBusiness,
    listUnassignedContainerBusiness,
    listContainerBusiness,
    //delinkContainerBusiness,
    //listUnassignedELocksBusiness,
};
