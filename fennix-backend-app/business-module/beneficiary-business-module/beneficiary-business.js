const {getBenefeciaryAggregator, getBeneficiaryListByOwnerIdForDownloadAccessor, addBeneficiaryAccessor, getBeneficiaryByBeneficiaryIdAccesor, getBeneficiaryDetailsAccessor, getBeneficiaryListByOwnerId, getBeneifciaryIdList, getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {mapMarkerQuery} = require('../../repository-module/data-accesors/location-accesor');
const {objectHasPropertyCheck, deviceStatusMapper, arrayNotEmptyCheck, notNullCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {getUserIdsForAllRolesAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {deviceBybeneficiaryQuery, getDeviceDetailsForListOfBeneficiariesAccessor} = require('../../repository-module/data-accesors/device-accesor');
const {excelRowsCreator, excelColCreator} = require('../../util-module/request-validators');
const Excel = require('exceljs');

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
const addBeneficiaryBusiness = async (req) => {
    let request = req.body;
    await addBeneficiaryAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', []);
};

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
                imei: objectHasPropertyCheck(item['imei']) && notNullCheck(item['imei']) ? item['imei'] : 999999999,
                documentId: item['document_id'],
                mobileNo: item['mobileno'],
                image: item['image'],
                roleName: item['role'],
                beneficiaryRoleId: item['role_id'],
                // email: item['emailid'],
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
            let noOfViolations = 0;
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId] = [];
            const batteryVoltage = deviceStatusMapper('batteryVoltage', item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage);
            if (batteryVoltage['deviceStatus'] === 'violation') {
                noOfViolations += 1;
            }
            const batteryPercentage = deviceStatusMapper('batteryPercentage', item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryPercentage);
            if (batteryPercentage['deviceStatus'] === 'violation') {
                noOfViolations += 1;
            }
            if (item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus) {
                noOfViolations += 1;
            }
            if (item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus) {
                noOfViolations += 1;
            }
            if (item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus) {
                noOfViolations += 1;
            }
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Percentage',
                status: batteryPercentage['deviceStatus'],
                key: 'batteryPercentage',
                icon: 'battery_charging_full',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryPercentage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Voltage',
                key: 'batteryVoltage',
                icon: 'battery_std',
                status: batteryVoltage['deviceStatus'],
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Belt Status',
                key: 'beltStatus',
                icon: 'link',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus ? 'violation' : 'safe',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Shell Status',
                key: 'shellStatus',
                icon: 'lock',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus ? 'violation' : 'safe',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'GPS Status',
                key: 'gpsStatus',
                icon: 'gps_fixed',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus ? 'violation' : 'safe',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Speed',
                key: 'speed',
                icon: 'directions_run',
                status: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed > 0 ? 'moving' : 'still',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed
            });
            beneficiaryDevices = {...deviceDetails};
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['deviceDetails'] = deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId];
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['noOfViolations'] = {
                text: 'No of Violations',
                value: noOfViolations
            };
            gridData[item.latestBeneficiaryDeviceDetails.beneficiaryId] = {...beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]};
            gridData[item.latestBeneficiaryDeviceDetails.beneficiaryId]['deviceTypeName'] = item.deviceType[0]['name'];
        });
        beneficiaryReturnObj['markers'] = [];
        Object.keys(beneficiaryFilter).forEach((marker) => {
            if (deviceLocDeviceList.indexOf(marker) !== -1) {
                beneficiaryReturnObj['markers'].push(beneficiaryFilter[marker])
            }
        });
        beneficiaryReturnObj['deviceDetails'] = beneficiaryDevices;
        beneficiaryReturnObj['deviceDetailsArray'] = Object.keys(beneficiaryDevices).map((device) => beneficiaryDevices[device]);
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
    response = await getBeneficiaryByBeneficiaryIdAccesor(request);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        const finalObj = {
            beneficiaryRoleId: response.rows[0]['beneficiary_role'],
            image: response.rows[0]['image'],
            beneficiaryRole: response.rows[0]['role_name'],
            gender: response.rows[0]['gender'],
            emailId: response.rows[0]['emailid'],
            beneficiaryName: `${response.rows[0]['full_name']}`,
            mobileNo: response.rows[0]['mobileno'],
            beneficiaryAddress: response.rows[0]['address1'],
            documentId: response.rows[0]['document_id'],
            beneficiaryDOB: response.rows[0]['dob']
        };
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', finalObj);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return finalResponse;
};

const beneficiaryListByOwnerUserId = async (req) => {
    let request = {
            userId: req.query.userId,
            centerId: req.query.centerId,
            offset: req.query.offset,
            limit: req.query.limit
        }, beneficiaryListResponse,
        returnObj, totalNoOfRecords, modifiedResponse = [], beneficiaryIds = [], deviceDetailsMap = {},
        finalResponse = {}, reqToGetTotalRecords = [req.query.userId, req.query.centerId], userIdList = [];
    userIdList = await getUserIdsForAllRolesAccessor(req);
    request.userIdList = userIdList;
    beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
    totalNoOfRecords = await getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor(reqToGetTotalRecords);
    finalResponse['totalNoOfRecords'] = totalNoOfRecords.rows[0]['count'];
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        beneficiaryListResponse.rows.forEach(item => {
            beneficiaryIds.push(`${item['beneficiaryid']}`);
        });

        let deviceDetailsResponse = await getDeviceDetailsForListOfBeneficiariesAccessor(beneficiaryIds);
        deviceDetailsResponse.forEach(device => {
            const obj = {
                deviceId: device['_id'],
                imei: objectHasPropertyCheck(device, 'imei') && notNullCheck(device['imei']) ? device['imei'] : '999999999',
                deviceType: device['deviceType'][0]['name']
            };
            deviceDetailsMap[device['beneficiaryId']] = obj;
        });

        beneficiaryListResponse.rows.forEach(item => {
            const res = {
                documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
                beneficiaryId: item['beneficiaryid'],
                beneficiaryRole: item['role_name'],
                beneficiaryRoleId: item['beneficiary_role'],
                beneficiaryGender: item['gender'],
                beneficiaryName: item['full_name'],
                emailId: item['emailid'],
                mobileNo: item['mobileno'],
                center: objectHasPropertyCheck(item, 'center_name') && notNullCheck(item['center_name']) ? item['center_name'] : 'Center Not Assigned',
                crimeDetails: item['crime_id'],
                imei: deviceDetailsMap[item['beneficiaryid']]['imei'],
                deviceType: deviceDetailsMap[item['beneficiaryid']]['deviceType'],
                deviceId: deviceDetailsMap[item['beneficiaryid']]['deviceId']
            };
            modifiedResponse.push(res);
        });
        finalResponse['gridData'] = modifiedResponse;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

// const beneficiaryListByOwnerUserId = async (req) => {
//     let request = [req.query.userId, req.query.centerId, req.query.skip, req.query.limit], beneficiaryListResponse,
//         returnObj, totalNoOfRecords, modifiedResponse = [], beneficiaryIds = [], deviceDetailsMap = {},
//         finalResponse = {}, reqToGetTotalRecords = [req.query.userId, req.query.centerId];
//     beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
//     totalNoOfRecords = await getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor(reqToGetTotalRecords);
//     finalResponse['totalNoOfRecords'] = totalNoOfRecords.rows[0]['count'];
//     if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
//         beneficiaryListResponse.rows.forEach(item => {
//             beneficiaryIds.push(`${item['beneficiaryid']}`);
//         });
//
//         let deviceDetailsResponse = await getDeviceDetailsForListOfBeneficiariesAccessor(beneficiaryIds);
//         deviceDetailsResponse.forEach(device => {
//             const obj = {
//                 deviceId: device['_id'],
//                 imei: objectHasPropertyCheck(device, 'imei') && notNullCheck(device['imei']) ? device['imei'] : '999999999',
//                 deviceType: device['deviceType'][0]['name']
//             };
//             deviceDetailsMap[device['beneficiaryId']] = obj;
//         });
//
//         beneficiaryListResponse.rows.forEach(item => {
//             const res = {
//                 documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
//                 beneficiaryId: item['beneficiaryid'],
//                 beneficiaryRole: item['role_name'],
//                 beneficiaryRoleId: item['beneficiary_role'],
//                 beneficiaryGender: item['gender'],
//                 beneficiaryName: item['full_name'],
//                 emailId: item['emailid'],
//                 mobileNo: item['mobileno'],
//                 center: objectHasPropertyCheck(item, 'center_name') && notNullCheck(item['center_name']) ? item['center_name'] : 'Center Not Assigned',
//                 crimeDetails: item['crime_id'],
//                 imei: deviceDetailsMap[item['beneficiaryid']]['imei'],
//                 deviceType: deviceDetailsMap[item['beneficiaryid']]['deviceType'],
//                 deviceId: deviceDetailsMap[item['beneficiaryid']]['deviceId']
//             };
//             modifiedResponse.push(res);
//         });
//         finalResponse['gridData'] = modifiedResponse;
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', finalResponse);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
//     }
//     return returnObj;
// };

const downloadBeneficiariesBusiness = async (req) => {
    let request = {}, colsKeysResponse, rowsIdsResponse, workbook = new Excel.Workbook(), userIdList,
        beneficiaryListResponse, modifiedResponse, beneficiaryIds,keysArray,
        returnObj = {}, sheet = workbook.addWorksheet('Beneficiary Sheet');
    colsKeysResponse = await excelColCreator();
    sheet.columns = colsKeysResponse['cols'];
    keysArray = colsKeysResponse['keysArray'];
    userIdList = await getUserIdsForAllRolesAccessor(req);
    request.userIdList = userIdList;
    beneficiaryListResponse = await getBeneficiaryListByOwnerIdForDownloadAccessor(request);
    rowsIdsResponse = excelRowsCreator(beneficiaryListResponse, 'beneficiaries', keysArray);
    beneficiaryIds = rowsIdsResponse['ids'];
    returnObj = rowsIdsResponse['rows'];
    if (arrayNotEmptyCheck(beneficiaryIds)) {
        let deviceDetailsResponse = await getDeviceDetailsForListOfBeneficiariesAccessor(beneficiaryIds);
        if (arrayNotEmptyCheck(deviceDetailsResponse)) {
            deviceDetailsResponse.forEach(device => {
                returnObj[device['beneficiaryId']] = {
                    ...returnObj[device['beneficiaryId']],
                    deviceId: device['_id'],
                    imei: objectHasPropertyCheck(device, 'imei') && notNullCheck(device['imei']) ? device['imei'] : '999999999',
                    deviceType: device['deviceType'][0]['name']
                }
            });
        }
    }
    modifiedResponse = Object.keys(returnObj).map(key => returnObj[key]);
    sheet.addRows(modifiedResponse);
    return workbook.xlsx.writeFile('/home/sindhura.gudarada/Downloads/test.xlsx');
};

module.exports = {
    beneficiaryAggregatorBusiness,
    beneficiaryListByOwnerUserId,
    beneficiaryMapDataList,
    getBeneficiaryDetailsBusiness,
    addBeneficiaryBusiness,
    downloadBeneficiariesBusiness
    // beneficiaryLocationListByOwnerAndCenter
};
