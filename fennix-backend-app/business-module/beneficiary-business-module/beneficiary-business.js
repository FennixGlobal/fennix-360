const beneficiaryAccessor = require('../../repository-module/data-accesors/beneficiary-accesor');
const {objectHasPropertyCheck, deviceStatusMapper, arrayNotEmptyCheck, notNullCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {getUserIdsForAllRolesAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {deviceBybeneficiaryQuery, getDeviceDetailsForListOfBeneficiariesAccessor} = require('../../repository-module/data-accesors/device-accesor');
const {imageStorageBusiness, emailSendBusiness} = require('../common-business-module/common-business');
const {excelRowsCreator, excelColCreator} = require('../../util-module/request-validators');
const Excel = require('exceljs');
const restrictionAccessor = require('../../repository-module/data-accesors/restriction-accesor');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const {dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
var fetch = require('isomorphic-fetch');
const atob = require('atob');
// const fs = require('fs');
var dropbox = require('dropbox').Dropbox;
var dropBoxItem = new dropbox({
    accessToken: '6-m7U_h1YeAAAAAAAAAAV0CNy7fXzgtcE3i1PSumhkQaaW2QfdioPQEZGSq3VXbf',
    fetch: fetch
});

const {updateDeviceWithBeneficiaryIdAccessor} = require('../../repository-module/data-accesors/device-accesor');
const beneficiaryAggregatorBusiness = async (req) => {
    let beneficiaryResponse, returnObj, userIdsList;
    userIdsList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    beneficiaryResponse = await beneficiaryAccessor.getBenefeciaryAggregator({
        languageId: req.query.languageId,
        userIdList: userIdsList
    });
    if (objectHasPropertyCheck(beneficiaryResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let beneficiaryObj = {
            victim: {key: 'victims', value: '', color: '', legend: 'VICTIM'},
            offender: {key: 'offenders', value: '', color: '', legend: 'OFFENDER'},
        };
        if (beneficiaryResponse.rows.length === 1) {
            let propName = beneficiaryResponse.rows[0]['role_name'].toLowerCase();
            let propName2 = propName.toLowerCase() === 'victim' ? 'victim' : "offender";
            beneficiaryObj[propName]['value'] = beneficiaryResponse.rows[0]['count'];
            beneficiaryObj[propName2]['value'] = 0;
        } else {
            beneficiaryResponse.rows.forEach((item) => {
                if (notNullCheck(item['role_name'])) {
                    beneficiaryObj[item['role_name'].toLowerCase()]['value'] = item['count'];
                }
            });
        }
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const deleteBeneficiaryBusiness = async (req) => {
    let request = {body: {beneficiaryId: req.query.beneficiaryId, isActive: false}}, response, finalResponse;
    response = await beneficiaryAccessor.updateBeneficiaryAccessor(request);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', 'Deleted beneficiary data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'en', '');
    }
    return finalResponse;
};

const addBeneficiaryBusiness = async (req) => {
    let request = req.body, restrictionRequest, response, primaryKeyResponse;
    const date = new Date();
    let imageUpload;
    const fullDate = `${date.getDate()}${(date.getMonth() + 1)}${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    request.documentId = `PATDOJ-${fullDate}`;
    // request.image = imageStorageBusiness(request.image, 'BENEFICIARY');
    request.updated_date = new Date();
    request.created_date = new Date();
    // emailSendBusiness(request.emailId, 'BENEFICIARY');
    // console.log(request.image);
    if (objectHasPropertyCheck(request, 'image')) {
        // let base64Image = request.image.split(';base64,').pop();
        imageUpload = request.image;
        // await fs.writeFile('../../../beneficiary.jpg',base64Image,{encoding: 'base64'});
        delete request.image;
    }
    response = await beneficiaryAccessor.addBeneficiaryAccessor(request);
    const folderName = `Beneficiary_${response.rows[0]['beneficiaryid']}_${fullDate}`;
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
        const fileFormat = imageUpload.match(/:(.*?);/)[1].split('/')[1];
        console.log(fileFormat);
        imageUpload = dataURLtoFile(imageUpload, folderName);
        console.log(imageUpload);
        const profileResponse = await dropBoxItem.filesCreateFolderV2({path: `/pat-j/DO/${folderName}/profile`});
        if (notNullCheck(profileResponse) && objectHasPropertyCheck(profileResponse, 'metadata') && objectHasPropertyCheck(profileResponse['metadata'], 'path_lower')) {
            console.log(profileResponse);
            // const file = await fs.readFile('../../../beneficiary.jpg');
            // console.log(file);
            const fileName = `${folderName}.${fileFormat}`;
            console.log('file Name');
            console.log(fileName);
            let imageUploadResponse = await dropBoxItem.filesUpload({
                path: `${profileResponse['metadata']['path_lower']}/${fileName}`,
                contents: imageUpload
            }).catch((err) => {
                console.log(err)
            });
            console.log('image response');
            console.log(imageUploadResponse);
            if (notNullCheck(imageUploadResponse)) {
                // const file =
                // update DB with profile path
                // console.log(shareLink);
                let shareLink = await dropBoxItem.sharingCreateSharedLinkWithSettings({path: imageUploadResponse.path_lower}).catch((err) => {
                    console.log('sharing error');
                    console.log(err);
                });
                let replaceLink = shareLink.url.split('\/s\/')[1];
                replaceLink = `https://dl.dropboxusercontent.com/s/${replaceLink}`;
                const newReq = {
                    body: {
                        beneficiaryId: response.rows[0]['beneficiaryid'],
                        image: replaceLink
                    }
                };
                let imageUpdateForBenIdResponse = await beneficiaryAccessor.updateBeneficiaryAccessor(newReq);
                console.log(imageUpdateForBenIdResponse);
            }
        }
        if (objectHasPropertyCheck(request, 'geoFence') && notNullCheck(request['geoFence'])) {
            primaryKeyResponse = await restrictionAccessor.fetchLocRestrictionNextPrimaryKeyAccessor();
            console.log(primaryKeyResponse);
            restrictionRequest = {
                _id: primaryKeyResponse['_doc']['counter'],
                beneficiaryId: response.rows[0]['beneficiaryid'],
                restrictionName: request['geoFence']['mapTitle'],
                restrictionType: request['geoFence']['mapRestrictionType'],
                startDate: request['geoFence']['startDate'],
                finishDate: request['geoFence']['finishDate'],
                repeatRules: request['geoFence']['restrictionDays'],
                onAlert: request['geoFence']['onAlert'],
                isActive: true,
                locationDetails: request['geoFence']['mapLocation']
            };
            await restrictionAccessor.addLocationRestrictionAccessor(restrictionRequest);
        }
        const newRequest = {...request, ...{beneficiaryId: response.rows[0]['beneficiaryid']}};
        await beneficiaryAccessor.addFamilyInfoAccessor(newRequest);
        if (objectHasPropertyCheck(newRequest, 'cvCode') || objectHasPropertyCheck(newRequest, 'creditCard') || objectHasPropertyCheck(newRequest, 'startDate') || objectHasPropertyCheck(newRequest, 'expiryDate')) {
            await beneficiaryAccessor.addAccountingAccessor(newRequest);
        }
    }
    return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', []);
};
const dataURLtoFile = (dataurl, filename) => {
    let newArray = dataurl.split(',')[1];
    let bufferImg = new Buffer(newArray, 'base64');
    // var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    // console.log('new Array');
    // console.log(newArray);
    // let binaryStream = atob(newArray);
    // console.log('binary stream');
    // console.log(binaryStream);
    // let arrayLength = newArray.length;
    // console.log('binary length');
    // let uIntArray = new Uint8Array(arrayLength);
    // let i = 0;
    // for (i;i<arrayLength;i++){
    //     uIntArray[i] = binaryStream.charCodeAt(n);
    // }
    // console.log('uInt Array');
    // console.log(uIntArray.buffer);
    // while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    // }
    // const file = new File([u8arr], filename, {type: mime});
    // return uIntArray.buffer;
    return bufferImg;
};
const beneficiaryListForUnAssignedDevicesBusiness = async () => {
    let response, modifiedResponse = [], finalResponse;
    response = await beneficiaryAccessor.beneficiaryListOfUnAssignedDevicesAccesor([]);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                id: item['beneficiaryid'],
                primaryValue: {text: 'Full Name', value: item['full_name']}
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const beneficiaryMapDataList = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, parseInt(req.body.skip), req.body.limit, req.body.languageId],
        beneficiaryReturnObj = {}, gridData = {}, locationObj = {},
        beneficiaryDevices = {}, beneficiaryListResponse, returnObj;
    beneficiaryListResponse = await beneficiaryAccessor.getBeneifciaryIdList(request);
    if (objectHasPropertyCheck(beneficiaryListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryIdListAndDetailObj, beneficiaryDeviceArray;
        beneficiaryIdListAndDetailObj = beneficiaryListResponse.rows.reduce((init, item) => {
            init.beneficiaryIdArray.push(parseInt(item.beneficiaryid));
            init.beneficiaryDetailObj[item.beneficiaryid] = {
                beneficiaryId: item['beneficiaryid'],
                firstName: item['firstname'],
                documentId: item['document_id'],
                mobileNo: item['mobileno'],
                image: item['image'],
                emailId: item['emailid'],
                roleName: item['role'],
                beneficiaryRoleId: item['role_id'],
                gender: item['gender']
            };
            return init;
        }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
        beneficiaryDeviceArray = await deviceBybeneficiaryQuery(beneficiaryIdListAndDetailObj.beneficiaryIdArray);
        beneficiaryDeviceArray.forEach((item) => {
            locationObj[item.beneficiaryId] = {...beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.beneficiaryId]};
            locationObj[item.beneficiaryId]['location'] = {
                longitude: item.location.longitude,
                latitude: item.location.latitude
            };
            beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.beneficiaryId]['imei'] = item['device']['imei'];
            locationObj[item.beneficiaryId]['roleId'] = beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.beneficiaryId]['roleId'];
            const deviceDetails = {};
            let noOfViolations = 0;
            deviceDetails[item.beneficiaryId] = [];
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
            deviceDetails[item.beneficiaryId].push({
                text: 'Battery',
                status: batteryPercentage['deviceStatus'],
                key: 'batteryPercentage',
                icon: 'battery_charging_full',
                value: `${item.deviceAttributes.batteryPercentage}%`
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'Belt',
                key: 'beltStatus',
                icon: 'link',
                status: item.deviceAttributes.beltStatus === 1 ? 'violation' : 'safe',
                value: item.deviceAttributes.beltStatus === 1 ? 'belt' : 'OK'
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'Shell',
                key: 'shellStatus',
                icon: 'lock',
                status: item.deviceAttributes.shellStatus === 1 ? 'violation' : 'safe',
                value: item.deviceAttributes.shellStatus === 1 ? 'shell' : 'OK'
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'GSM',
                key: 'gmsStatus',
                icon: 'signal_cellular_4_bar',
                status: item.deviceAttributes.gsmSignal < 2 ? 'violation' : 'safe',
                value: item.deviceAttributes.gsmSignal < 2 ? 'Low' : 'OK'
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'RF Home',
                key: 'rfConnectionStatus',
                icon: 'home',
                status: item.deviceAttributes.rfConnectionStatus === 0 ? 'violation' : 'safe',
                value: item.deviceAttributes.rfConnectionStatus === 0 ? 'Outdoor' : 'Home'
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'RFID',
                key: 'rfPlugStatus',
                icon: 'rss_feed',
                status: item.deviceAttributes.rfPlugStatus === 0 ? 'violation' : 'safe',
                value: item.deviceAttributes.rfPlugStatus === 0 ? 'Out' : 'In'
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'SAT',
                key: 'gpsStatus',
                icon: 'gps_fixed',
                status: item.deviceAttributes.gpsStatus === 'V' ? 'violation' : 'safe',
                value: GPS[item.deviceAttributes.gpsStatus]
            });
            deviceDetails[item.beneficiaryId].push({
                text: 'Speed',
                key: 'speed',
                icon: 'directions_run',
                status: item.deviceAttributes.speed > 0 ? 'moving' : 'still',
                value: Math.floor(item.deviceAttributes.speed)
            });
            beneficiaryDevices = {...deviceDetails};
            const completeDate = new Date(`${item.deviceAttributes.deviceUpdatedDate}`);
            const modifiedDate = `${completeDate.toLocaleDateString('es')} ${completeDate.toLocaleTimeString()}`;
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.beneficiaryId]['deviceUpdatedDate'] = modifiedDate;
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.beneficiaryId]['deviceDetails'] = deviceDetails[item.beneficiaryId];
            beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.beneficiaryId]['noOfViolations'] = {
                text: 'Number of Violations',
                value: noOfViolations
            };
            locationObj[item.beneficiaryId]['noOfViolations'] = noOfViolations;
            gridData[item.beneficiaryId] = {...beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.beneficiaryId]};
        });
        beneficiaryReturnObj['markers'] = Object.keys(locationObj).map(key => locationObj[key]);
        beneficiaryReturnObj['deviceDetails'] = beneficiaryDevices;
        beneficiaryReturnObj['deviceDetailsArray'] = Object.keys(beneficiaryDevices).map((device) => beneficiaryDevices[device]);
        beneficiaryReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
        beneficiaryReturnObj['markerDetails'] = gridData;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', beneficiaryReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const getBeneficiaryDetailsBusiness = async (req) => {
    let request = [req.query.beneficiaryId, req.query.languageId], response, finalResponse;
    response = await beneficiaryAccessor.getBeneficiaryByBeneficiaryIdAccesor(request);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
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
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalObj);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return finalResponse;
};

const beneficiaryListByOwnerUserId = async (req) => {
    let request = {
            userId: req.query.userId,
            centerId: req.query.centerId,
            skip: req.query.skip,
            limit: req.query.limit
        }, beneficiaryListResponse, finalReturnObj = {}, returnObj, totalNoOfRecords, beneficiaryIds = [],
        finalResponse = {}, userIdList;
    // console.log(req);
    // console.log(userIdList);
    userIdList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    request.userIdList = userIdList;
    beneficiaryListResponse = await beneficiaryAccessor.getBeneficiaryListByOwnerId(request);
    totalNoOfRecords = await beneficiaryAccessor.getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor(request);
    finalResponse['totalNoOfRecords'] = totalNoOfRecords.rows[0]['count'];
    if (objectHasPropertyCheck(beneficiaryListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        beneficiaryListResponse.rows.forEach(item => {
            finalReturnObj[item['beneficiaryid']] = {
                documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
                beneficiaryId: item['beneficiaryid'],
                beneficiaryRole: item['role_name'],
                beneficiaryRoleId: item['beneficiary_role'],
                beneficiaryGender: item['gender'],
                beneficiaryName: item['full_name'],
                emailId: item['emailid'],
                mobileNo: item['mobileno'],
                image: item['image'],
                center: objectHasPropertyCheck(item, 'center_name') && notNullCheck(item['center_name']) ? item['center_name'] : 'Center Not Assigned',
                crimeDetails: item['crime_id'],
            };
            beneficiaryIds.push(item['beneficiaryid']);
        });

        let deviceDetailsResponse = await getDeviceDetailsForListOfBeneficiariesAccessor(beneficiaryIds);
        if (arrayNotEmptyCheck(deviceDetailsResponse)) {
            deviceDetailsResponse.forEach(device => {
                finalReturnObj[device['beneficiaryId']] = {
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

const listBeneficiariesForAddTicketBusiness = async (req) => {
    let userIdList, beneficiaryListResponse, finalResponse, responseList = {dropdownList: []}, request = {};
    userIdList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    request.userIdList = userIdList;
    beneficiaryListResponse = await beneficiaryAccessor.getBeneficiaryListForAddTicketAccessor(request);
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        beneficiaryListResponse.rows.forEach(item => {
            responseList.dropdownList.push(dropdownCreator(item['beneficiaryid'], item['full_name'], false));
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', responseList);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return finalResponse;
};

// const beneficiaryListByOwnerUserId = async (req) => {
//     let request = [req.query.userId, req.query.centerId, req.query.skip, req.query.limit], beneficiaryListResponse,
//         returnObj, totalNoOfRecords, modifiedResponse = [], beneficiaryIds = [], deviceDetailsMap = {},
//         finalResponse = {}, reqToGetTotalRecords = [req.query.userId, req.query.centerId];
//     beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
//     totalNoOfRecords = await getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor(reqToGetTotalRecords);
//     finalResponse['totalNoOfRecords'] = totalNoOfRecords.rows[0]['count'];
//     if (objectHasPropertyCheck(beneficiaryListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
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
//         returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
//     } else {
//         returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
//     }
//     return returnObj;
// };

const downloadBeneficiariesBusiness = async (req) => {
    let request = {}, colsKeysResponse, rowsIdsResponse, workbook = new Excel.Workbook(), userIdList,
        beneficiaryListResponse, modifiedResponse, beneficiaryIds, keysArray,
        returnObj = {}, sheet = workbook.addWorksheet('Beneficiary Sheet');
    colsKeysResponse = await excelColCreator();
    sheet.columns = colsKeysResponse['cols'];
    keysArray = colsKeysResponse['keysArray'];
    userIdList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    request.userIdList = userIdList;
    beneficiaryListResponse = await beneficiaryAccessor.getBeneficiaryListByOwnerIdForDownloadAccessor(request);
    rowsIdsResponse = excelRowsCreator(beneficiaryListResponse, 'beneficiaries', keysArray);
    beneficiaryIds = rowsIdsResponse['ids'];
    returnObj = rowsIdsResponse[COMMON_CONSTANTS.FENNIX_ROWS];
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

const getAllBeneficiaryDetailsBusiness = async (req) => {
    let request = [req.query.beneficiaryId], response, modifiedResponse, benResponse, finalResponse;
    response = await beneficiaryAccessor.getAllBeneficiaryDetailsAccessor(request);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        benResponse = response.rows[0];
        console.log(benResponse);
        modifiedResponse = {
            beneficiaryId: benResponse['beneficiaryid'],
            firstName: benResponse['firstname'],
            middleName: benResponse['middle_name'],
            lastName: benResponse['first_last_name'],
            secondName: benResponse['second_last_name'],
            role: benResponse['beneficiary_role'],
            gender: benResponse['gender'],
            image: benResponse['image'],
            emailId: benResponse['emailid'],
            mobileNo: benResponse['mobileno'],
            dob: benResponse['dob'],
            address: benResponse['address1'],
            crimeId: benResponse['crime_id'],
            hasHouseArrest: benResponse['hashousearrest'],
            weight: benResponse['weight'],
            height: benResponse['height'],
            eyeColor: benResponse['eye_color'],
            hairColor: benResponse['hair_color'],
            scarsMarksTatoos: benResponse['scars_marks_tatoos'],
            riskId: benResponse['risk_id'],
            ethnicityId: benResponse['ethnicity_id'],
            zipCode: benResponse['postal_code'],
            center: benResponse['center_id'],
            operatorId: benResponse['owner_user_id'],
            isActive: benResponse['isactive'],
            comments: benResponse['comments'],
            timeZone: benResponse['time_zone'],
            languageId: benResponse['language_id'],
            whatsAppNo: benResponse['whatsapp_number'],
            sentenceLawyerId: benResponse['lawyer_id'],
            sentenceTutorId: benResponse['tutor_id'],
            sentenceDistrictAttorneyId: benResponse['district_attorney'],
            sentenceJudgeId: benResponse['judge'],
            sentenceCourtHouseId: benResponse['court_house'],
            sentenceCountryId: benResponse['sentence_country'],
            sentenceCityId: benResponse['sentence_city'],
            // scentenceLawyerId:sentence_house_arrest: null,
            // scentenceLawyerId:sentence_restraining_order: null,
        };
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const updateBeneficiaryBusiness = async (req) => {
    let response, finalResponse;
    response = await beneficiaryAccessor.updateBeneficiaryAccessor(req);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', 'Updated beneficiary data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_BENEFICIARIES_FOR_ID, 'en', '');
    }
    return finalResponse;
};

const addDeviceForBeneficiaryBusiness = async (req) => {
    let request, finalResponse;
    await beneficiaryAccessor.updateBeneficiaryAccessor(req);
    request = {
        beneficiaryId: parseInt(req.body.beneficiaryId, 10),
        deviceId: parseInt(req.body.deviceId, 10)
    };
    await updateDeviceWithBeneficiaryIdAccessor(request);
    finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', 'Updated beneficiary data successfully');
    return finalResponse;
};

module.exports = {
    addDeviceForBeneficiaryBusiness,
    beneficiaryAggregatorBusiness,
    beneficiaryListByOwnerUserId,
    beneficiaryMapDataList,
    getBeneficiaryDetailsBusiness,
    addBeneficiaryBusiness,
    listBeneficiariesForAddTicketBusiness,
    downloadBeneficiariesBusiness,
    updateBeneficiaryBusiness,
    deleteBeneficiaryBusiness,
    beneficiaryListForUnAssignedDevicesBusiness,
    getAllBeneficiaryDetailsBusiness
};
