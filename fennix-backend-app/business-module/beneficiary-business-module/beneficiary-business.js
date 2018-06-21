const {getBenefeciaryAggregator, getBeneficiaryDetailsAccessor, getBeneficiaryListByOwnerId, getBeneifciaryIdList, getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {mapMarkerQuery} = require('../../repository-module/data-accesors/location-accesor');
const {objectHasPropertyCheck, deviceStatusMapper, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {deviceBybeneficiaryQuery} = require('../../repository-module/data-accesors/device-accesor');

const beneficiaryAggregatorBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], beneficiaryResponse, returnObj;
    beneficiaryResponse = await getBenefeciaryAggregator(request);
    if (objectHasPropertyCheck(beneficiaryResponse, 'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let beneficiaryObj = {
            VICTIM: {key: 'victims', value: '', color: '', legend: 'VICTIM'},
            OFFENDER: {key: 'offenders', value: '', color: '', legend: 'OFFENDER'},
        };
        if (beneficiaryResponse.rows.length === 1) {
            let propName = beneficiaryResponse.rows[0]['role_name'];
            //TODO interchange victim and offender
            let propName2 = propName === 'VICTIM' ? 'VICTIM' : "OFFENDER";
            beneficiaryObj[propName]['value'] = beneficiaryResponse.rows[0]['count'];
            beneficiaryObj[propName2]['value'] = 0;
        } else {
            beneficiaryResponse.rows.forEach((item) => {
                // item['role_name'] = item['role_name'] === 'VICTIM' ? 'OFFENDER' : "VICTIM";
                beneficiaryObj[item['role_name'].toUpperCase()]['value'] = item['count'];
            });
        }
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

// var beneficiaryListByOwnerUserId = async (req) => {
//     let request = [req.body.userId, req.body.centerId, req.body.sort, (req.body.currentPage * req.body.pageSize), req.body.pageSize],
//         beneficiaryListResponse, returnObj;
//     beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
//     if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
//         let beneficiaryObj = {};
//         beneficiaryObj['headerArray'] = Object.keys(beneficiaryListResponse.rows[0]).map(item => item);
//         beneficiaryObj['bodyArray'] = beneficiaryListResponse.rows;
//
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
//     }
//     return returnObj;
// };

// const beneficiaryLocationListByOwnerAndCenter = async (req) => {
//     let request = [req.body.userId, req.body.centerId, req.body.sort, (req.body.pagination.currentPage * req.body.pagination.pageSize), req.body.pagination.pageSize],
//         beneficiaryIdListResponse, returnObj;
//     beneficiaryIdListResponse = await getBeneifciaryIdList(request);
//     if (objectHasPropertyCheck(beneficiaryIdListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryIdListResponse.rows)) {
//         let beneficiaryIdListAndDetailObj, beneficiaryLocArray;
//         beneficiaryIdListAndDetailObj = beneficiaryIdListResponse.rows.reduce((init, item) => {
//             init.beneficiaryIdArray.push(`${item.beneficiaryid}`);
//             init.beneficiaryDetailObj[item.beneficiaryid] = item;
//             return init;
//         }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
//         beneficiaryLocArray = await  mapMarkerQuery(beneficiaryIdListAndDetailObj.beneficiaryIdArray);
//         const beneficiaryFliter = {};
//         beneficiaryLocArray.forEach((item) => {
//             beneficiaryFliter[item.latestBeneficiaryLocation.beneficiaryId] = beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.latestBeneficiaryLocation.beneficiaryId];
//             beneficiaryFliter[item.latestBeneficiaryLocation.beneficiaryId]['location'] = {
//                 latitude: item.latestBeneficiaryLocation.latitude,
//                 longitude: item.latestBeneficiaryLocation.longitude
//             };
//         });
//         const beneficiaryMapArray = Object.keys(beneficiaryFliter)
//             .map((marker) => beneficiaryFliter[marker]);
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryMapArray);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
//     }
//     return returnObj;
// };
const beneficiaryMapDataList = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, parseInt(req.body.skip), req.body.limit, req.query.languageId],
        beneficiaryFilter = {}, beneficiaryReturnObj = {}, gridData = {},
        locBeneficiaryIdList = [], beneficiaryDevices = {}, deviceLocDeviceList = [],
        beneficiaryListResponse, returnObj, beneficiaryLocArray;
    beneficiaryListResponse = await getBeneifciaryIdList(request);
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryIdListAndDetailObj, beneficiaryDeviceArray;
        beneficiaryIdListAndDetailObj = beneficiaryListResponse.rows.reduce((init, item) => {
            init.beneficiaryIdArray.push(`${item.beneficiaryid}`);
            init.beneficiaryDetailObj[item.beneficiaryid] = {
                beneficiaryId: item['beneficiaryid'],
                firstName: item['firstname'],
                imei: item['imei'],
                roleName: item['role'],
                roleId: item['role_id'],
                email: item['emailid'],
                gender: item['gender']
            };
            return init;
        }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
        beneficiaryLocArray = await  mapMarkerQuery([...beneficiaryIdListAndDetailObj.beneficiaryIdArray]);
        beneficiaryLocArray.forEach((item) => {
            beneficiaryFilter[item.latestBeneficiaryLocation.beneficiaryId] = {...beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.latestBeneficiaryLocation.beneficiaryId]};
            beneficiaryFilter[item.latestBeneficiaryLocation.beneficiaryId]['location'] = {
                latitude: item.latestBeneficiaryLocation.latitude,
                longitude: item.latestBeneficiaryLocation.longitude
            };
            locBeneficiaryIdList.push(item.latestBeneficiaryLocation.beneficiaryId);
            beneficiaryFilter[item.latestBeneficiaryLocation.beneficiaryId]['roleId'] = beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.latestBeneficiaryLocation.beneficiaryId]['roleId'];
        });
        beneficiaryDeviceArray = await deviceBybeneficiaryQuery(locBeneficiaryIdList);
        beneficiaryDeviceArray.forEach((item) => {
            deviceLocDeviceList.push(item.latestBeneficiaryDeviceDetails.beneficiaryId);
            const deviceDetails = {};
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId] = [];
            const batteryVoltage = deviceStatusMapper('batteryVoltage', item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage);
            const batteryPercentage = deviceStatusMapper('batteryPercentage', item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryPercentage);
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Percentage',
                status: batteryPercentage['status'],
                statusColor: batteryPercentage['color'],
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryPercentage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Voltage',
                status: batteryVoltage['status'],
                statusColor: batteryVoltage['color'],
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Belt Status',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus ? 'violation' : 'safe',
                statusColor: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus ? 'RED' : 'GREEN',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Shell Status',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus ? 'violation' : 'safe',
                statusColor: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus ? 'RED' : 'GREEN',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'GPS Status',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus ? 'violation' : 'safe',
                statusColor: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus ? 'RED' : 'GREEN',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Speed',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed > 0 ? 'still' : 'moving',
                statusColor: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed > 0 ? 'BLUE' : 'GREEN',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed
            });
            beneficiaryDevices = {...deviceDetails};
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['deviceDetails'] = {...deviceDetails};
            gridData[item.latestBeneficiaryDeviceDetails.beneficiaryId] = {...beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]};
        });
        beneficiaryReturnObj['markers'] = [];
        Object.keys(beneficiaryFilter).forEach((marker) => {
            if (deviceLocDeviceList.indexOf(marker) !== -1) {
                beneficiaryReturnObj['markers'].push(beneficiaryFilter[marker])
            }
        });
        beneficiaryReturnObj['deviceDetails'] = beneficiaryDevices;
        beneficiaryReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
        beneficiaryReturnObj['markerDetails'] = gridData;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

const getBeneficiaryDetailsBusiness = async (req) => {
    let request = [req.query.beneficiaryId, req.query.languageId], response, finalResponse;
    response = await getBeneficiaryDetailsAccessor(request);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', response.rows[0]);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return finalResponse;
};

const beneficiaryListByOwnerUserId = async (req) => {
    let request = [req.query.userId, req.query.centerId, req.query.offset, req.query.limit], beneficiaryListResponse,
        returnObj, totalNoOfRecords, modifiedResponse = [], beneficiaryIds = [], deviceDetailsMap = {},
        finalResponse = {}, reqToGetTotalRecords = [req.query.userId, req.query.centerId];
    beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
    totalNoOfRecords = await getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor(reqToGetTotalRecords);
    finalResponse['totalNoOfRecords'] = totalNoOfRecords.rows[0]['count'];
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        // let beneficiaryObj = {};
        // beneficiaryObj['headerArray'] = Object.keys(beneficiaryListResponse.rows[0]).map(item => item);
        // beneficiaryObj['bodyArray'] = beneficiaryListResponse.rows;

        beneficiaryListResponse.rows.forEach(item => {
            beneficiaryIds.push(`${item['beneficiaryid']}`);
        });

        let deviceDetailsResponse = await getDeviceDetailsForListOfBeneficiariesAccessor(beneficiaryIds);
        deviceDetailsResponse.forEach(device => {
            const obj = {
                deviceId: device['_id'],
                imei: device['imei'],
                deviceType: device['deviceType'][0]['name']
            };
            deviceDetailsMap[device['beneficiaryId']] = obj;
        });

        beneficiaryListResponse.rows.forEach(item => {
            const res = {
                beneficiaryId: item['beneficiaryid'],
                beneficiaryRole: item['role_name'],
                beneficiaryRoleId: item['beneficiary_role'],
                beneficiaryGender: item['gender'],
                beneficiaryName: item['full_name'],
                emailId: item['emailid'],
                mobileNo: item['mobileno'],
                center: item['center_name'],
                crimeDetails: item['crime_id'],
                imei: deviceDetailsMap[item['beneficiaryid']]['imei'],
                deviceType: deviceDetailsMap[item['beneficiaryid']]['deviceType'],
                deviceId: deviceDetailsMap[item['beneficiaryid']]['deviceId']
            };
            modifiedResponse.push(res);
        });
        finalResponse['beneficiaries'] = modifiedResponse;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

module.exports = {
    beneficiaryAggregatorBusiness,
    beneficiaryListByOwnerUserId,
    beneficiaryMapDataList,
    getBeneficiaryDetailsBusiness
    // beneficiaryLocationListByOwnerAndCenter
};
