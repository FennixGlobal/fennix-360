const deviceAccessor = require('../../repository-module/data-accesors/device-accesor');
const {notNullCheck, objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {getBeneficiaryByUserIdAccessor, getBeneficiaryNameFromBeneficiaryIdAccessor} = require('../../repository-module/data-accesors/beneficiary-accesor');
const userAccessor = require('../../repository-module/data-accesors/user-accesor');
const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const centerMetadataAccessors = require('../../repository-module/data-accesors/metadata-accesor');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {getCenterIdsForLoggedInUserAndSubUsersAccessor} = require('../../repository-module/data-accesors/location-accesor');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');

const deviceAggregatorDashboard = async (req) => {
    let beneficiaryResponse, deviceResponse, returnObj, userIdList;
    userIdList = await userAccessor.getUserIdsForAllRolesAccessor(req,COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    beneficiaryResponse = await getBeneficiaryByUserIdAccessor(userIdList);
    if (objectHasPropertyCheck(beneficiaryResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let deviceArray = [];
        beneficiaryResponse.rows.forEach((item) => {
            deviceArray.push(item.beneficiaryid);
        });
        deviceResponse = await deviceAccessor.deviceAggregator(deviceArray);
    }
    if (notNullCheck(deviceResponse) && arrayNotEmptyCheck(deviceResponse)) {
        let deviceObj = {
            ACTIVE: {key: 'activeDevices', value: '', color: '', legend: 'ACTIVE'},
            INACTIVE: {key: 'inActiveDevices', value: '', color: '', legend: 'INACTIVE'}
        };
        if (deviceResponse.length === 1) {
            let propertyName = deviceResponse[0]['_id'] ? 'ACTIVE' : 'INACTIVE';
            let propertyName2 = propertyName === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            deviceObj[propertyName]['value'] = deviceResponse[0]['count'];
            deviceObj[propertyName2]['value'] = 0;
        } else {
            deviceResponse.forEach((item) => {
                let prop = item['_id'] ? 'ACTIVE' : 'INACTIVE';
                deviceObj[prop]['value'] = item['count'];
            });
        }
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', deviceObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

//TODO: change response logic
const listDeviceTypesBusiness = async () => {
    let deviceTypesResponse, finalResponse, deviceTypesListResponse = {dropdownList: []};
    deviceTypesResponse = await deviceAccessor.listDeviceTypesAccessor();
    if (arrayNotEmptyCheck(deviceTypesResponse)) {
        deviceTypesResponse.forEach((item) => {
            deviceTypesListResponse.dropdownList.push(dropdownCreator(item['_id'], item['name'], false));
        });
    }
    finalResponse = arrayNotEmptyCheck(deviceTypesResponse) ? fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', deviceTypesListResponse) : fennixResponse(statusCodeConstants.STATUS_NO_DEVICE_TYPES_FOR_ID, 'EN_US', deviceTypesListResponse);
    return finalResponse;
};

const listDevicesBusiness = async (req) => {
    let userIdList, centerIdResponse, centerIdsReq = [], centerIdNameMap = {},
        beneficiaryIdNameMap = {}, devicesResponse, beneficiaryNameResponse, beneficiaryIds = [],
        modifiedResponse = {gridData: []}, finalResponse;
    userIdList = await userAccessor.getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    centerIdResponse = await getCenterIdsForLoggedInUserAndSubUsersAccessor(userIdList);
    if (objectHasPropertyCheck(centerIdResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(centerIdResponse.rows)) {
        centerIdResponse.rows.forEach(item => {
            centerIdsReq.push(item['center_id']);
            centerIdNameMap[item['center_id']] = item['center_name'];
        });
        devicesResponse = await deviceAccessor.listDevicesAccessor(centerIdsReq);
    }

    if (arrayNotEmptyCheck(devicesResponse)) {
        devicesResponse.forEach((item) => {
            beneficiaryIds.push(`${item['beneficiaryId']}`);
        });
        beneficiaryNameResponse = await getBeneficiaryNameFromBeneficiaryIdAccessor(beneficiaryIds, req.query.languageId);
        if (objectHasPropertyCheck(beneficiaryNameResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryNameResponse.rows)) {
            beneficiaryNameResponse.rows.forEach((item) => {
                let beneficiaryObj = {
                    fullName: item['full_name'],
                    roleName: item['role_name'],
                    roleId: item['beneficiary_role']
                };
                beneficiaryIdNameMap[item['beneficiaryid']] = beneficiaryObj;
            });
        }
        devicesResponse.forEach((item) => {
            deviceObj = {
                deviceId: item['_id'],
                deviceType: item['deviceTypes']['name'],
                imei: item['imei'],
                isActive: item['active'],
                mobileNo: item['simcards']['phoneNo'],
                center: centerIdNameMap[item['centerId']],
                beneficiaryName: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'fullName') ? beneficiaryIdNameMap[item['beneficiaryId']]['fullName'] : '-',
                beneficiaryRole: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleName') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleName'] : '-',
                beneficiaryRoleId: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleId') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleId'] : '-'
            };
            modifiedResponse.gridData.push(deviceObj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

//
// const listDevicesBusiness = async (req) => {
//     let centerIdResponse, centerIdsReq = [], centerIdNameMap = {},
//         beneficiaryIdNameMap = {}, devicesResponse, beneficiaryNameResponse, beneficiaryIds = [],
//         modifiedResponse = {gridData: []}, finalResponse;
//     centerIdResponse = await centerMetadataAccessors.getCenterIdsAccessor(req);
//     if (objectHasPropertyCheck(centerIdResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(centerIdResponse.rows)) {
//         centerIdResponse.rows.forEach(item => {
//             centerIdsReq.push(item['location_id']);
//             centerIdNameMap[item['location_id']] = item['location_name'];
//         });
//         devicesResponse = await listDevicesAccessor(centerIdsReq);
//     }
//
//     if (arrayNotEmptyCheck(devicesResponse)) {
//         devicesResponse.forEach((item) => {
//             beneficiaryIds.push(item['beneficiaryId']);
//         });
//         beneficiaryNameResponse = await getBeneficiaryNameFromBeneficiaryIdAccessor(beneficiaryIds, req.query.languageId);
//         if (objectHasPropertyCheck(beneficiaryNameResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryNameResponse.rows)) {
//             beneficiaryNameResponse.rows.forEach((item) => {
//                 let beneficiaryObj = {
//                     fullName: item['full_name'],
//                     roleName: item['role_name'],
//                     roleId: item['beneficiary_role']
//                 };
//                 beneficiaryIdNameMap[item['beneficiaryid']] = beneficiaryObj;
//             });
//         }
//         devicesResponse.forEach((item) => {
//             deviceObj = {
//                 deviceId: item['_id'],
//                 deviceType: item['deviceTypes']['name'],
//                 imei: item['imei'],
//                 isActive: item['isActive'],
//                 mobileNo: item['simcards']['phoneNo'],
//                 center: centerIdNameMap[item['centerId']],
//                 beneficiaryName: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'fullName') ? beneficiaryIdNameMap[item['beneficiaryId']]['fullName'] : '-',
//                 beneficiaryRole: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleName') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleName'] : '-',
//                 beneficiaryRoleId: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleId') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleId'] : '-'
//             };
//             modifiedResponse.gridData.push(deviceObj);
//         });
//         finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
//     } else {
//         finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'EN_US', []);
//     }
//     return finalResponse;
// };

const insertDeviceBusiness = async (req) => {
    let primaryKeyResponse, counter;
    primaryKeyResponse = await deviceAccessor.fetchNextPrimaryKeyAccessor();
    if (objectHasPropertyCheck(primaryKeyResponse, '_doc')) {
        counter = parseInt(primaryKeyResponse['_doc']['counter']);
        let obj = {
            _id: counter,
            imei: req.body.imei,
            centerId: req.body.centerId,
            simCardId: req.body.simCardId,
            deviceTypeId: req.body.deviceTypeId,
            active: req.body.isActive,
            createdDate: new Date()
        };
        await deviceAccessor.insertDeviceAccessor(obj);
        // await deviceAccessor.insertNextPrimaryKeyAccessor(primaryKeyResponse[0]['_doc']['_id']);
    }
};

const getDeviceByDeviceIdBusiness = async (req) => {
    const request = {deviceId: req.query.deviceId};
    let deviceResponse, returnObj;
    deviceResponse = await deviceAccessor.getDeviceByDeviceIdAccessor(request);
    if (notNullCheck(deviceResponse)) {
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', deviceResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'EN_US', []);
    }
    return returnObj;
};

/**@description : This method provides the complete data for the device by beneficiaryId.
 * It first gets the latest device attributes by fetching the device details from device attributes table using the deviceId from the deviceLocationMaster.
 * along with the device attributes it gets the device details from the device table also
  // * @param req.query : beneficiaryId
 * @returns complete device details
 */
const getDeviceDetailsByBeneficiaryIdBusiness = async (req) => {
    const request = {beneficiaryId: parseInt(req.query.beneficiaryId)};
    let deviceResponse, returnObj,finalResponse = {};
    deviceResponse = await deviceAccessor.getDeviceByBeneficiaryIdAccessor(request);
    if (notNullCheck(deviceResponse)) {
        finalResponse['beneficiaryId'] = deviceResponse[0]['beneficiaryId'];
        finalResponse = {...finalResponse,...deviceResponse[0].device,...deviceResponse[0].deviceAttributes};
        console.log(finalResponse);
        console.log(deviceResponse);
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'EN_US', []);
    }
    return returnObj;
};

module.exports = {
    deviceAggregatorDashboard,
    listDevicesBusiness,
    insertDeviceBusiness,
    getDeviceByDeviceIdBusiness,
    listDeviceTypesBusiness,
    getDeviceDetailsByBeneficiaryIdBusiness
};