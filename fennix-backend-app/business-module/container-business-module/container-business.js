const containerAccessors = require('../../repository-module/data-accesors/container-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck, deviceStatusMapper} = require('../../util-module/data-validators');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const deviceAccessors = require('../../repository-module/data-accesors/device-accesor');
const userAccessors = require('../../repository-module/data-accesors/user-accesor');

const addContainerDetailsBusiness = async (req) => {
    let request = req.body;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    request.isActive = true;
    console.log(request);
    await containerAccessors.addContainerDetailsAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_CONTAINER_ADDED_SUCCESS, 'EN_US', []);
};

// const listContainerBusiness = async () => {
//     let returnObj, totalNoOfRecords, finalResponse = {}, containerListResponse, containerIds = [], finalReturnObj = {};
//     containerListResponse = await containerAccessors.listContainersAccessor();
//     totalNoOfRecords = await containerAccessors.getTotalNoOfContainersAccessor();
//     finalResponse['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
//     if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
//         containerListResponse.rows.forEach(item => {
//             finalReturnObj[item['container_id']] = {
//                 documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
//                 containerId: item['container_id'],
//                 containerType: item['container_type'],
//                 containerName: item['container_name'],
//                 companyName: item['company_name'],
//                 image: item['container_image']
//             };
//             containerIds.push(item['container_id']);
//         });
//         let deviceDetailsResponse = await deviceAccessors.getDeviceDetailsForListOfContainersAccessor(containerIds);
//         if (arrayNotEmptyCheck(deviceDetailsResponse)) {
//             deviceDetailsResponse.forEach(device => {
//                 finalReturnObj[device['containerId']] = {
//                     ...finalReturnObj[device['containerId']],
//                     deviceId: device['_id'],
//                     imei: objectHasPropertyCheck(device, 'imei') && notNullCheck(device['imei']) ? device['imei'] : '999999999',
//                     deviceType: objectHasPropertyCheck(device, 'deviceType') && arrayNotEmptyCheck(device['deviceType']) ? device['deviceType'][0]['name'] : 'No Device Type'
//                 };
//             });
//         }
//         finalResponse['gridData'] = Object.keys(finalReturnObj).map(key => finalReturnObj[key]);
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
//     }
//     return returnObj;
// };

const listContainerBusiness = async (req) => {
    let returnObj, totalNoOfRecords, userResponse,  finalResponse = {}, containerListResponse, containerIds = [], finalReturnObj = {}, request = {sortBy: req.query.sort, skip:req.query.skip, limit: req.query.limit};
    userResponse = await userAccessors.getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
    request.userIdList = userResponse.userIdsList;
    request.nativeUserRole = userResponse.nativeUserRole;
    containerListResponse = await containerAccessors.listContainersAccessor(request);
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersAccessor(request);
    finalResponse['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        containerListResponse.rows.forEach(item => {
            finalReturnObj[item['container_id']] = {
                documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
                containerId: item['container_id'],
                containerType: item['container_type'],
                containerName: item['container_name'],
                companyName: item['company_name'],
                image: item['container_image']
            };
            containerIds.push(item['container_id']);
        });
        let deviceDetailsResponse = await deviceAccessors.getDeviceDetailsForListOfContainersAccessor(containerIds);
        if (arrayNotEmptyCheck(deviceDetailsResponse)) {
            deviceDetailsResponse.forEach(device => {
                finalReturnObj[device['containerId']] = {
                    ...finalReturnObj[device['containerId']],
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

const listUnassignedContainerBusiness = async () => {
    let response, modifiedResponse = [], finalResponse;
    response = await containerAccessors.listUnAssignedContainersAccessor([]);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                containerId: item['container_id'],
                containerName: item['container_name'],
                id: item['container_id'],
                containerType: item['container_type'],
                companyName: item['container_name']
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const deactivateContainerBusiness = async (req) => {
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

const assignContainerBusiness = async (req) => {
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
// const containerMapDataListBusiness = async (req) => {
//     let request = [req.body.sort, parseInt(req.body.skip), parseInt(req.body.limit)],
//         containerReturnObj = {}, gridData = {}, locationObj = {},
//         containerDevices = {}, containerListResponse, returnObj;
//     containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
//     if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
//         let containerIdListAndDetailObj, containerDeviceArray;
//         containerIdListAndDetailObj = containerListResponse.rows.reduce((init, item) => {
//             init.containerIdArray.push(parseInt(item.container_id));
//             init.containerDetailObj[item.container_id] = {
//                 containerId: item['container_id'],
//                 containerName: item['container_name'],
//                 documentId: item['document_id'],
//                 image: item['container_image']
//             };
//             return init;
//         }, {containerIdArray: [], containerDetailObj: {}});
//         containerDeviceArray = await deviceAccessors.deviceByContainerAccessor(containerIdListAndDetailObj.containerIdArray);
//         containerDeviceArray.forEach((item) => {
//             locationObj[item.containerId] = {...containerIdListAndDetailObj['containerDetailObj'][item.containerId]};
//             locationObj[item.containerId]['location'] = {
//                 longitude: item.location.longitude,
//                 latitude: item.location.latitude
//             };
//             containerIdListAndDetailObj['containerDetailObj'][item.containerId]['imei'] = item['device']['imei'];
//             // locationObj[item.containerId]['roleId'] = containerIdListAndDetailObj['containerDetailObj'][item.containerId]['roleId'];
//             const deviceDetails = {};
//             let noOfViolations = 0;
//             deviceDetails[item.containerId] = [];
//             const GPS = {A: 'Valid', V: 'Invalid'};
//             const batteryPercentage = deviceStatusMapper('batteryPercentage', item.deviceAttributes.batteryPercentage);
//             if (batteryPercentage['deviceStatus'] === 'violation') {
//                 noOfViolations += 1;
//             }
//             if (item.deviceAttributes.beltStatus) {
//                 noOfViolations += 1;
//             }
//             if (item.deviceAttributes.shellStatus) {
//                 noOfViolations += 1;
//             }
//             deviceDetails[item.containerId].push({
//                 text: 'Battery',
//                 status: batteryPercentage['deviceStatus'],
//                 key: 'batteryPercentage',
//                 icon: 'battery_charging_full',
//                 value: `${item.deviceAttributes.batteryPercentage}%`
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'Belt',
//                 key: 'beltStatus',
//                 icon: 'link',
//                 status: item.deviceAttributes.beltStatus === 1 ? 'violation' : 'safe',
//                 value: item.deviceAttributes.beltStatus === 1 ? 'belt' : 'OK'
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'Shell',
//                 key: 'shellStatus',
//                 icon: 'lock',
//                 status: item.deviceAttributes.shellStatus === 1 ? 'violation' : 'safe',
//                 value: item.deviceAttributes.shellStatus === 1 ? 'shell' : 'OK'
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'GSM',
//                 key: 'gmsStatus',
//                 icon: 'signal_cellular_4_bar',
//                 status: item.deviceAttributes.gsmSignal < 2 ? 'violation' : 'safe',
//                 value: item.deviceAttributes.gsmSignal < 2 ? 'Low' : 'OK'
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'RF Home',
//                 key: 'rfConnectionStatus',
//                 icon: 'home',
//                 status: item.deviceAttributes.rfConnectionStatus === 0 ? 'violation' : 'safe',
//                 value: item.deviceAttributes.rfConnectionStatus === 0 ? 'Outdoor' : 'Home'
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'RFID',
//                 key: 'rfPlugStatus',
//                 icon: 'rss_feed',
//                 status: item.deviceAttributes.rfPlugStatus === 0 ? 'violation' : 'safe',
//                 value: item.deviceAttributes.rfPlugStatus === 0 ? 'Out' : 'In'
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'SAT',
//                 key: 'gpsStatus',
//                 icon: 'gps_fixed',
//                 status: item.deviceAttributes.gpsStatus === 'V' ? 'violation' : 'safe',
//                 value: GPS[item.deviceAttributes.gpsStatus]
//             });
//             deviceDetails[item.containerId].push({
//                 text: 'Speed',
//                 key: 'speed',
//                 icon: 'directions_run',
//                 status: item.deviceAttributes.speed > 0 ? 'moving' : 'still',
//                 value: Math.floor(item.deviceAttributes.speed)
//             });
//             containerDevices = {...deviceDetails};
//             const completeDate = new Date(`${item.deviceAttributes.deviceUpdatedDate}`);
//             const modifiedDate = `${completeDate.toLocaleDateString('es')} ${completeDate.toLocaleTimeString()}`;
//             containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceUpdatedDate'] = modifiedDate;
//             containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceDetails'] = deviceDetails[item.containerId];
//             containerIdListAndDetailObj.containerDetailObj[item.containerId]['noOfViolations'] = {
//                 text: 'Number of Violations',
//                 value: noOfViolations
//             };
//             locationObj[item.containerId]['noOfViolations'] = noOfViolations;
//             gridData[item.containerId] = {...containerIdListAndDetailObj.containerDetailObj[item.containerId]};
//         });
//         containerReturnObj['markers'] = Object.keys(locationObj).map(key => locationObj[key]);
//         containerReturnObj['deviceDetails'] = containerDevices;
//         containerReturnObj['deviceDetailsArray'] = Object.keys(containerDevices).map((device) => containerDevices[device]);
//         containerReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
//         containerReturnObj['markerDetails'] = gridData;
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', containerReturnObj);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
//     }
//     return returnObj;
// };

const containerMapDataListBusiness = async (req) => {
    let request = {sortBy: req.body.sort, offset: parseInt(req.body.skip), limit:parseInt(req.body.limit)},
        containerReturnObj = {}, gridData = {}, locationObj = {}, totalNoOfRecords,
        containerDevices = {}, containerListResponse, returnObj, userResponse, userRequest;
    userRequest = {query:{userId: req.body.userId, languageId: req.body.languageId}};
    userResponse = await userAccessors.getUserIdsForAllRolesAccessor(userRequest, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
    request.userIdList = userResponse.userIdsList;
    containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersAccessor(request);
    console.log(containerListResponse);
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        let containerIdListAndDetailObj, containerDeviceArray;
        containerIdListAndDetailObj = containerListResponse.rows.reduce((init, item) => {
            init.containerIdArray.push(parseInt(item.container_id));
            init.containerDetailObj[item.container_id] = {
                containerId: item['container_id'],
                containerName: item['container_name'],
                documentId: item['document_id'],
                image: item['container_image']
            };
            return init;
        }, {containerIdArray: [], containerDetailObj: {}});
        containerDeviceArray = await deviceAccessors.deviceByContainerAccessor(containerIdListAndDetailObj.containerIdArray);
        containerDeviceArray.forEach((item) => {
            locationObj[item.containerId] = {...containerIdListAndDetailObj['containerDetailObj'][item.containerId]};
            locationObj[item.containerId]['location'] = {
                longitude: item.location.longitude,
                latitude: item.location.latitude
            };
            containerIdListAndDetailObj['containerDetailObj'][item.containerId]['imei'] = item['device']['imei'];
            // locationObj[item.containerId]['roleId'] = containerIdListAndDetailObj['containerDetailObj'][item.containerId]['roleId'];
            const deviceDetails = {};
            let noOfViolations = 0;
            deviceDetails[item.containerId] = [];
            const GPS = {A: 'Valid', V: 'Invalid'};
            const batteryPercentage = deviceStatusMapper('batteryPercentage', item.deviceAttributes.batteryPercentage);
            if (batteryPercentage['deviceStatus'] === 'violation') {
                noOfViolations += 1;
            }
            if (item.deviceAttributes.beltStatus) {
                noOfViolations += 1;
            }
            if (item.deviceAttributes.shellStatus) {
                noOfViolations += 1;
            }
            deviceDetails[item.containerId].push({
                text: 'Battery',
                status: batteryPercentage['deviceStatus'],
                key: 'batteryPercentage',
                icon: 'battery_charging_full',
                value: `${item.deviceAttributes.batteryPercentage}%`
            });
            deviceDetails[item.containerId].push({
                text: 'Belt',
                key: 'beltStatus',
                icon: 'link',
                status: item.deviceAttributes.beltStatus === 1 ? 'violation' : 'safe',
                value: item.deviceAttributes.beltStatus === 1 ? 'belt' : 'OK'
            });
            deviceDetails[item.containerId].push({
                text: 'Shell',
                key: 'shellStatus',
                icon: 'lock',
                status: item.deviceAttributes.shellStatus === 1 ? 'violation' : 'safe',
                value: item.deviceAttributes.shellStatus === 1 ? 'shell' : 'OK'
            });
            deviceDetails[item.containerId].push({
                text: 'GSM',
                key: 'gmsStatus',
                icon: 'signal_cellular_4_bar',
                status: item.deviceAttributes.gsmSignal < 2 ? 'violation' : 'safe',
                value: item.deviceAttributes.gsmSignal < 2 ? 'Low' : 'OK'
            });
            deviceDetails[item.containerId].push({
                text: 'RF Home',
                key: 'rfConnectionStatus',
                icon: 'home',
                status: item.deviceAttributes.rfConnectionStatus === 0 ? 'violation' : 'safe',
                value: item.deviceAttributes.rfConnectionStatus === 0 ? 'Outdoor' : 'Home'
            });
            deviceDetails[item.containerId].push({
                text: 'RFID',
                key: 'rfPlugStatus',
                icon: 'rss_feed',
                status: item.deviceAttributes.rfPlugStatus === 0 ? 'violation' : 'safe',
                value: item.deviceAttributes.rfPlugStatus === 0 ? 'Out' : 'In'
            });
            deviceDetails[item.containerId].push({
                text: 'SAT',
                key: 'gpsStatus',
                icon: 'gps_fixed',
                status: item.deviceAttributes.gpsStatus === 'V' ? 'violation' : 'safe',
                value: GPS[item.deviceAttributes.gpsStatus]
            });
            deviceDetails[item.containerId].push({
                text: 'Speed',
                key: 'speed',
                icon: 'directions_run',
                status: item.deviceAttributes.speed > 0 ? 'moving' : 'still',
                value: Math.floor(item.deviceAttributes.speed)
            });
            containerDevices = {...deviceDetails};
            const completeDate = new Date(`${item.deviceAttributes.deviceUpdatedDate}`);
            const modifiedDate = `${completeDate.toLocaleDateString('es')} ${completeDate.toLocaleTimeString()}`;
            containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceUpdatedDate'] = modifiedDate;
            containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceDetails'] = deviceDetails[item.containerId];
            containerIdListAndDetailObj.containerDetailObj[item.containerId]['noOfViolations'] = {
                text: 'Number of Violations',
                value: noOfViolations
            };
            locationObj[item.containerId]['noOfViolations'] = noOfViolations;
            gridData[item.containerId] = {...containerIdListAndDetailObj.containerDetailObj[item.containerId]};
        });
        containerReturnObj['markers'] = Object.keys(locationObj).map(key => locationObj[key]);
        containerReturnObj['deviceDetails'] = containerDevices;
        containerReturnObj['deviceDetailsArray'] = Object.keys(containerDevices).map((device) => containerDevices[device]);
        containerReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
        containerReturnObj['markerDetails'] = gridData;
        containerReturnObj['totalNoOfRecords'] = totalNoOfRecords;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', containerReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

module.exports = {
    addContainerDetailsBusiness,
    assignContainerBusiness,
    deactivateContainerBusiness,
    listUnassignedContainerBusiness,
    listContainerBusiness,
    containerMapDataListBusiness,
    //delinkContainerBusiness,
    //listUnassignedELocksBusiness,
};
