const {deviceAggregator, listDevicesAccessor} = require('../../repository-module/data-accesors/device-accesor');
const {notNullCheck, objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {getBeneficiaryByUserIdAccessor, getBeneficiaryNameFromBeneficiaryIdAccessor} = require('../../repository-module/data-accesors/beneficiary-accesor');
const userAccessor = require('../../repository-module/data-accesors/user-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const centerMetadataAccessors = require('../../repository-module/data-accesors/metadata-accesor');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const deviceAggregatorDashboard = async (req) => {
    const request = [req.query.languageId, req.query.userId];
    let beneficiaryResponse, deviceResponse, returnObj, userDetailResponse, otherUserIdsForGivenUserId, userIdList = [];
    userDetailResponse = await userAccessor.getUserNameFromUserIdAccessor(request);
    if (objectHasPropertyCheck(userDetailResponse, 'rows') && arrayNotEmptyCheck(userDetailResponse.rows)) {
        let nativeUserRole = userDetailResponse.rows[0]['native_user_role'];
        switch (nativeUserRole) {
            case 'ROLE_SUPERVISOR' : {
                otherUserIdsForGivenUserId = await userAccessor.getUserIdsForSupervisorAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_ADMIN' : {
                otherUserIdsForGivenUserId = await userAccessor.getUserIdsForAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_SUPER_ADMIN' : {
                otherUserIdsForGivenUserId = await userAccessor.getUserIdsForSuperAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_MASTER_ADMIN' : {
                otherUserIdsForGivenUserId = await userAccessor.getUserIdsForMasterAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
        }

        // otherUserIdsForGivenUserId = getLowerLevelUserIdsForGivenUserId(userDetailResponse.rows[0]['native_user_role'], userDetailResponse.rows[0]['user_id'], req.query.languageId);
        otherUserIdsForGivenUserId.rows.forEach(item => {
            userIdList.push(item['user_id']);
        });
    }
    beneficiaryResponse = await getBeneficiaryByUserIdAccessor(userIdList);
    if (objectHasPropertyCheck(beneficiaryResponse, 'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let deviceArray = [];
        beneficiaryResponse.rows.forEach((item) => {
            deviceArray.push(`${item.beneficiaryid}`);
        });
        deviceResponse = await deviceAggregator(deviceArray);
    }
    if (notNullCheck(deviceResponse) && arrayNotEmptyCheck(deviceResponse)) {
        let deviceObj = {
            ACTIVE: {key: 'activeDevices', value: '', color: '',legend:'ACTIVE'},
            INACTIVE: {key: 'inActiveDevices', value: '', color: '',legend:'INACTIVE'}
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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', deviceObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
const listDevicesBusiness = async (req) => {
    let request = [req.query.userId], userDetailResponse, centerIdResponse, centerIdsReq = [], centerIdNameMap = {}, beneficiaryIdNameMap = {}, devicesResponse, beneficiaryNameResponse, beneficiaryIds = [], modifiedResponse = {gridData:[]}, finalResponse;
    userDetailResponse = await userAccessor.getUserNameFromUserIdAccessor([req.query.languageId, req.query.userId]);
    if (objectHasPropertyCheck(userDetailResponse, 'rows') && arrayNotEmptyCheck(userDetailResponse.rows)) {
        let nativeUserRole = userDetailResponse.rows[0]['native_user_role'];
        switch (nativeUserRole) {
            case 'ROLE_OPERATOR' : {
                centerIdResponse = await centerMetadataAccessors.getCenterIdsForOperatorAccessor(request);
                break;
            }
            case 'ROLE_SUPERVISOR' : {
                centerIdResponse = await centerMetadataAccessors.getCenterIdsForSupervisorAccessor(request);
                break;
            }
            case 'ROLE_ADMIN' : {
                centerIdResponse = await centerMetadataAccessors.getCenterIdsForAdminAccessor(request);
                break;
            }
            case 'ROLE_SUPER_ADMIN' : {
                centerIdResponse = await centerMetadataAccessors.getCenterIdsForSuperAdminAccessor(request);
                break;
            }
            case 'ROLE_MASTER_ADMIN' : {
                centerIdResponse = await centerMetadataAccessors.getCenterIdsForMasterAdminAccessor(request);
                break;
            }
        }
    }
    if (objectHasPropertyCheck(centerIdResponse, 'rows') && arrayNotEmptyCheck(centerIdResponse.rows)) {
        centerIdResponse.rows.forEach(item => {
            centerIdsReq.push(`${item['location_id']}`);
            centerIdNameMap[item['location_id']] = item['location_name'];
        });
        devicesResponse = await listDevicesAccessor(centerIdsReq);
    }

    if (arrayNotEmptyCheck(devicesResponse)) {
        devicesResponse.forEach((item) => {
            beneficiaryIds.push(item['beneficiaryId']);
        });
        beneficiaryNameResponse = await getBeneficiaryNameFromBeneficiaryIdAccessor(beneficiaryIds, req.query.languageId);
        if (objectHasPropertyCheck(beneficiaryNameResponse, 'rows') && arrayNotEmptyCheck(beneficiaryNameResponse.rows)) {
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
                isActive: item['isActive'],
                mobileNo: item['simcards']['phoneNo'],
                center: centerIdNameMap[item['centerId']],
                beneficiaryName: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'fullName') ? beneficiaryIdNameMap[item['beneficiaryId']]['fullName'] : '-',
                beneficiaryRole: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleName') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleName'] : '-',
                beneficiaryRoleId: objectHasPropertyCheck(beneficiaryIdNameMap[item['beneficiaryId']], 'roleId') ? beneficiaryIdNameMap[item['beneficiaryId']]['roleId'] : '-'
            };
            modifiedResponse.gridData.push(deviceObj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'en', []);
    }
    return finalResponse;
};

module.exports = {
    deviceAggregatorDashboard,
    listDevicesBusiness
};