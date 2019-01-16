const containerAccessors = require('../../repository-module/data-accesors/container-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck, deviceStatusMapper} = require('../../util-module/data-validators');
const {filtersMapping} = require('../../util-module/db-constants');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const deviceAccessors = require('../../repository-module/data-accesors/device-accesor');
const userAccessors = require('../../repository-module/data-accesors/user-accesor');
const {socket} = require('../../../app');
const tripAccessors = require('../../repository-module/data-accesors/trip-accessor');
const {imageStorageBusiness, uploadToDropboxBusiness, shareDropboxLinkBusiness, notificationEmailBusiness, getDropdownNameFromKeyBusiness, createDropboxFolderBusiness} = require('../common-business-module/common-business');
const eLockSessionBusiness = require('../e-lock-business-module/e-lock-session-business');
const {getCountryCodeByLocationIdAccessor} = require('../../repository-module/data-accesors/location-accesor');

const addContainerDetailsBusiness = async (req) => {
    let request = req.body, imageUpload, countryCode, response, masterPasswordResponse;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    request.isActive = true;
    const date = new Date();
    const fullDate = `${date.getDate()}${(date.getMonth() + 1)}${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    if (objectHasPropertyCheck(request, 'containerImage')) {
        imageUpload = request.containerImage;
        delete request.containerImage;
    }
    // set the container to active if the beneficiary is not active
    request.isActive = notNullCheck(request.isActive) ? request.isActive : true;
    // getting country code for the given location id
    countryCode = await getCountryCodeByLocationIdAccessor([request.country]);
    countryCode = objectHasPropertyCheck(countryCode, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(countryCode.rows) && notNullCheck(countryCode.rows[0]['location_code']) ? countryCode.rows[0]['location_code'] : 'OO';
    countryCode = countryCode.indexOf('-') !== -1 ? countryCode.split('-')[1] : countryCode;
    request.documentId = `PAT${countryCode}L-${fullDate}`;
    masterPasswordResponse = await containerAccessors.fetchAndUpdateContainerPasswordCounterAccessor('containerMasterPasswordCounter');
    if (notNullCheck(masterPasswordResponse)) {
        request.masterPassword = masterPasswordResponse['containerMasterPasswordCounter'];
    }
    response = await containerAccessors.addContainerDetailsAccessor(request);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
        const folderName = `CONTAINERS_${response.rows[0]['container_id']}_${fullDate}`;
        const folderBasePath = `/pat-j/${countryCode}/${folderName}`;
        // adding image to the dropbox
        const fileLocations = await imageStorageBusiness(imageUpload, folderBasePath, folderName, true);
        if (notNullCheck(fileLocations) && notNullCheck(fileLocations.sharePath) && notNullCheck(fileLocations.folderBasePath)) {
            const newReq = {
                containerId: response.rows[0]['container_id'],
                containerImage: fileLocations.sharePath,
                dropboxBasePath: fileLocations.folderBasePath
            };
            let imageUpdateForContainerIdResponse = await containerAccessors.updateContainerAccessor(newReq);
        }
    }
    return fennixResponse(statusCodeConstants.STATUS_CONTAINER_ADDED_SUCCESS, 'EN_US', []);
};
const editContainerBusiness = async (req) => {
    let response, finalResponse;
    response = await containerAccessors.editContainerAccessor(req);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_CONTAINER_EDIT_SUCCESS, 'EN_US', 'Updated container data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_CONTAINER_FOR_ID, 'EN_US', '');
    }
    return finalResponse;
};
/*const listContainerBusiness = async (req) => {
    let returnObj, totalNoOfRecords, userResponse, finalResponse = {}, containerListResponse, containerIds = [],
        finalReturnObj = {}, request = {sortBy: req.query.sort, skip: req.query.skip, limit: req.query.limit};
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
};*/
const listContainerBusiness = async (req) => {
    let returnObj, totalNoOfRecords, userResponse, finalResponse = {}, containerListResponse, containerIds = [],
        finalReturnObj = {}, request = {
            sortBy: req.query.sort,
            skip: req.query.skip,
            limit: req.query.limit,
            languageId: req.query.languageId
        };
    userResponse = await userAccessors.getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_ALL_NATIVE_USER_ROLE);
    request.userIdList = [];
    console.log('user response');
    console.log(userResponse);
    if (objectHasPropertyCheck(userResponse, 'userDetails') && objectHasPropertyCheck(userResponse.userDetails, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(userResponse.userDetails.rows)) {
        request.companyId = userResponse.nativeUserRole === COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_CLIENT ? userResponse.userDetails.rows[0]['company_id'] : null;
        userResponse.userDetails.rows.forEach((item) => request.userIdList.push(item['user_id']));
        request.nativeUserRole = userResponse.nativeUserRole;
    }
    containerListResponse = await containerAccessors.listContainersAccessor(request);
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersAccessor(request);
    finalResponse['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        containerListResponse.rows.forEach(item => {
            finalReturnObj[item['container_id']] = {
                documentId: objectHasPropertyCheck(item, 'document_id') && notNullCheck(item['document_id']) ? item['document_id'] : 'Document Id Not Present',
                containerId: item['container_id'],
                containerType: item['container_type_value'],
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
                companyName: item['company_name'],
                companyId: item['company_id']
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

const uploadBeneficiaryDocumentsBusiness = async (req) => {
    let documentName, finalResponse, beneficiaryResponse, uploadResponse, createResponse, countryCode,
        dropboxShareResponse;
    const date = new Date(),
        fullDate = `${date.getDate()}${(date.getMonth() + 1)}${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    const request = req.body, postgresReq = [req.body.containerId];
    beneficiaryResponse = await containerAccessors.getContainerDocumentByContainerIdAccessor(postgresReq);
    const documentReq = [request.documentType];
    const documentNameResponse = await getDropdownNameFromKeyBusiness(documentReq);
    if (objectHasPropertyCheck(documentNameResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(documentNameResponse.rows)) {
        documentName = notNullCheck(documentNameResponse[COMMON_CONSTANTS.FENNIX_ROWS][0]['dropdown_value']) ? documentNameResponse[COMMON_CONSTANTS.FENNIX_ROWS][0]['dropdown_value'] : 'Document';
    }
    if (objectHasPropertyCheck(beneficiaryResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        countryCode = notNullCheck(beneficiaryResponse[COMMON_CONSTANTS.FENNIX_ROWS][0]['location_code']) ? beneficiaryResponse[COMMON_CONSTANTS.FENNIX_ROWS][0]['location_code'] : 'OO';
        countryCode = countryCode.indexOf('-') !== -1 ? countryCode.split('-')[1] : countryCode;
        if (objectHasPropertyCheck(beneficiaryResponse[COMMON_CONSTANTS.FENNIX_ROWS][0], 'dropbox_base_path')) {
            uploadResponse = await uploadToDropboxBusiness(`${beneficiaryResponse[COMMON_CONSTANTS.FENNIX_ROWS][0]['dropbox_base_path']}/${documentName}`, request.document.fileData, request.documentName);
        } else {
            let folderName = `CONTAINER_${req.body.beneficiaryId}_${fullDate}`,
                folderBasePath = `/pat-l/${countryCode}/${folderName}`;
            createResponse = await createDropboxFolderBusiness(folderBasePath, documentName);
            if (createResponse) {
                uploadResponse = await uploadToDropboxBusiness(createResponse.folderLocation, request.document.fileData, request.documentName);
            }
        }
    }
    if (objectHasPropertyCheck(uploadResponse, 'uploadSuccessFlag') && uploadResponse['uploadSuccessFlag']) {
        const shareResponse = await shareDropboxLinkBusiness(uploadResponse.docUploadResponse.path_lower, false);
        const downloadPath = shareResponse.replace('?dl=0', '?dl=1');
        const fileFormat = request.document.fileType.split('/')[1];
        const documentObj = {
            documentId: `container_${req.body.beneficiaryId}_${documentName}_${fullDate}`,
            documentType: fileFormat,
            documentSize: request.document.fileSize,
            documentLink: downloadPath,
            documentName: request.documentName,
            documentOriginalName: request.document.fileName,
            createdDate: new Date(),
            createdByUser: request.document.createdBy
        };
        // dropboxShareResponse = await updateBeneficiaryDocumentPathBusiness(req.body.beneficiaryId, documentName.toLowerCase(), documentObj);
        finalResponse = fennixResponse(statusCodeConstants.STATUS_BENEFICIARY_DOC_UPLOAD_SUCCESS, 'EN_US', []);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return finalResponse;
};

const assignContainerBusiness = async (req) => {
    let request, finalResponse, tripRequest, latArray = [], lngArray = [], activePasswordResponse,
        elockTripPrimaryKeyResponse;
    req.body.startDate = new Date();
    req.body.deviceAssignedBy = req.body.userId;
    activePasswordResponse = await containerAccessors.fetchAndUpdateContainerPasswordCounterAccessor('containerActivePasswordCounter');
    // if (arrayNotEmptyCheck(activePasswordResponse)) {
    console.log(activePasswordResponse);
    let masterPasswordResponse = await containerAccessors.getContainerMasterPasswordAcessor([parseInt(req.body.containerId, 10)]);
    console.log(masterPasswordResponse);
    req.body.activePassword = activePasswordResponse['containerActivePasswordCounter'];
    if (objectHasPropertyCheck(masterPasswordResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(masterPasswordResponse.rows)) {
        // socket.socketIO.emit('set_active_password', {
        //     newPassword: activePasswordResponse['active_password'],
        //     oldPassword: '123456'
        // });
    }
    // }
    await containerAccessors.updateContainerAccessor(req.body);
    elockTripPrimaryKeyResponse = await tripAccessors.fetchNextElockTripPrimaryKeyAccessor();
    let elockTripPrimaryId = parseInt(elockTripPrimaryKeyResponse['_doc']['counter']);
    request = {
        containerId: parseInt(req.body.containerId, 10),
        deviceId: parseInt(req.body.deviceId, 10)
    };
    await deviceAccessors.updateDeviceWithContainerIdAccessor(request);
    console.log('trip Request');
    console.log(req.body);
    tripRequest = {
        tripId: elockTripPrimaryId,
        containerId: parseInt(req.body.containerId, 10),
        deviceId: parseInt(req.body.deviceId, 10),
        startAddress: objectHasPropertyCheck(req.body, 'address') ? req.body.address.startAddress : '',
        endAddress: objectHasPropertyCheck(req.body, 'address') ? req.body.address.endAddress : '',
        startDate: getDateTimeStamp(req.body.expectedStartDate, req.body.expectedStartTime),
        endDate: getDateTimeStamp(req.body.expectedEndDate, req.body.expectedEndTime),
        tripName: req.body.tripName,
        startTime: req.body.expectedStartTime,
        endTime: req.body.expectedEndTime,
        tripDuration: getTripDuration({
            startDate: req.body.expectedStartDate,
            startTime: req.body.expectedStartTime,
            endDate: req.body.expectedEndDate,
            endTime: req.body.expectedEndTime
        }),
        tripStatus: 'NOT_STARTED',
        notificationEmail1: req.body.notificationEmail1,
        notificationEmail2: req.body.notificationEmail2,
        notificationEmail3: req.body.notificationEmail3,
        isTripActive: true
    };
    restrictionRequestList = objectHasPropertyCheck(req.body, 'address') && objectHasPropertyCheck(req.body.address, 'restriction') && arrayNotEmptyCheck(req.body.address['restriction']) ? req.body.address['restriction'] : [];
    restrictionRequestList.forEach(item => {
        latArray.push(item['lat']);
        lngArray.push(item['lng']);
    });
    tripRequest = {
        ...tripRequest,
        restrictions: restrictionRequestList,
        latArray: latArray,
        lngArray: lngArray,
        createdDate: new Date()
    };
    await tripAccessors.insertElockTripDataAccessor(tripRequest);
    finalResponse = fennixResponse(statusCodeConstants.STATUS_DEVICE_ADD_SUCCESS, 'EN_US', 'Updated container data successfully');
    return finalResponse;
};
const containerMapDataListBusiness = async (req) => {
    let request = {
            sortBy: req.body.sort,
            offset: parseInt(req.body.skip),
            limit: parseInt(req.body.limit),
            languageId: req.body.languageId
        },
        containerReturnObj = {}, gridData = {}, locationObj = {}, totalNoOfRecords,
        containerDevices = {}, containerListResponse, returnObj, userResponse, userRequest;
    userRequest = {query: {userId: req.body.userId, languageId: req.body.languageId}};
    console.log(userRequest);
    userResponse = await userAccessors.getUserIdsForAllRolesAccessor(userRequest, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
    console.log(userResponse);
    request.userIdList = userResponse.userIdsList;
    request.nativeUserRole = userResponse.nativeUserRole;
    containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersForMapAccessor(request);
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        let containerIdListAndDetailObj, containerDeviceArray;
        containerIdListAndDetailObj = containerListResponse.rows.reduce((init, item) => {
            init.containerIdArray.push(parseInt(item.container_id));
            init.containerDetailObj[item.container_id] = {
                containerId: item['container_id'],
                containerName: item['container_name'],
                documentId: item['document_id'],
                containerLockStatus: item['container_lock_status'],
                image: item['container_image']
            };
            return init;
        }, {containerIdArray: [], containerDetailObj: {}});
        containerDeviceArray = await deviceAccessors.deviceByContainerAccessor(containerIdListAndDetailObj.containerIdArray);
        if (arrayNotEmptyCheck(containerDeviceArray)) {
            containerDeviceArray.forEach((item) => {
                locationObj[item.containerId] = {...containerIdListAndDetailObj['containerDetailObj'][item.containerId]};
                locationObj[item.containerId]['location'] = {
                    longitude: item.location.longitude,
                    latitude: item.location.latitude
                };
                containerIdListAndDetailObj['containerDetailObj'][item.containerId]['imei'] = item['device']['imei'];
                const deviceDetails = {};
                let noOfViolations = 0;
                deviceDetails[item.containerId] = [];
                const GPS = {A: 'Valid', V: 'Invalid'};
                let differenceTime = Math.floor(new Date().getTime() - new Date(`${item.deviceAttributes.serverDate}`).getTime() / 1000 / 60);
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
                    text: 'GSM',
                    key: 'gsmQuality',
                    icon: 'signal_cellular_4_bar',
                    status: item.deviceAttributes.gsmQuality < 2 ? 'violation' : 'safe',
                    value: item.deviceAttributes.gsmQuality < 2 ? 'Low' : 'OK'
                });
                deviceDetails[item.containerId].push({
                    text: 'Mileage',
                    key: 'mileage',
                    icon: 'directions_car',
                    status: item.deviceAttributes.mileage === 0 ? 'violation' : 'safe',
                    value: item.deviceAttributes.mileage === 0 ? 'Outdoor' : 'Home'
                });
                deviceDetails[item.containerId].push({
                    text: 'SAT',
                    key: 'gpsQuality',
                    icon: 'gps_fixed',
                    status: item.deviceAttributes.gpsQuality === 'V' ? 'violation' : 'safe',
                    value: GPS[item.deviceAttributes.gpsQuality]
                });
                deviceDetails[item.containerId].push({
                    text: 'Speed',
                    key: 'speed',
                    icon: 'directions_run',
                    status: item.deviceAttributes.speed > 0 ? 'moving' : 'still',
                    value: Math.floor(item.deviceAttributes.speed)
                });
                deviceDetails[item.containerId].push({
                    text: 'EStatus',
                    key: 'online',
                    icon: 'radio_button_checked',
                    status: differenceTime < 3 ? 'safe' : 'violation',
                    value: differenceTime < 3 ? 'Online' : 'Offline'
                });
                containerDevices = {...deviceDetails};
                const completeDate = new Date(`${item.deviceAttributes.deviceUpdatedDate}`);
                const modifiedDate = `${completeDate.toLocaleDateString('es')} ${completeDate.toLocaleTimeString('es')}`;
                const serverDate = new Date(`${item.deviceAttributes.serverDate}`);
                const modifiedServerDate = `${serverDate.toLocaleDateString('es')} ${serverDate.toLocaleTimeString('es')}`;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceUpdatedDate'] = modifiedDate;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['serverDate'] = modifiedServerDate;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceDetails'] = deviceDetails[item.containerId];
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['noOfViolations'] = {
                    text: 'Number of Violations',
                    value: noOfViolations
                };
                locationObj[item.containerId]['noOfViolations'] = noOfViolations;
                gridData[item.containerId] = {...containerIdListAndDetailObj.containerDetailObj[item.containerId]};
            });
        }
        containerReturnObj['markers'] = Object.keys(locationObj).map(key => locationObj[key]);
        containerReturnObj['deviceDetails'] = containerDevices;
        containerReturnObj['deviceDetailsArray'] = Object.keys(containerDevices).map((device) => containerDevices[device]);
        containerReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
        containerReturnObj['markerDetails'] = gridData;
        containerReturnObj['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', containerReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};
const unlockElockBusiness = async (req) => {
    const containerId = parseInt(req.query.containerId, 10);
    const activePasswordResponse = await containerAccessors.getActivePasswordForContainerIdAccessor([containerId]);
    let masterPasswordResponse = await containerAccessors.getContainerMasterPasswordAcessor([containerId]);
    const deviceIMEIId = await containerAccessors.getDeviceIMEIByContainerIdAccessor(containerId);
    console.log(deviceIMEIId);
    // if (objectHasPropertyCheck(activePasswordResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(activePasswordResponse.rows)) {
    // containerAccessors.setContainerLockStatusAccessor([containerId, false]);
    // activePasswordResponse.rows[0]['active_password']

    const eLockSessionData = await eLockSessionBusiness.getELockSessionBusiness(deviceIMEIId[0]['imei']);
    console.log(eLockSessionData);
    socket.socketIO.emit('unlock_device', {
        socketAddress: eLockSessionData[0]['connectingSocket'],
        password: '100000'
    });
    // }
    // console.log(masterPasswordResponse);
    // if (objectHasPropertyCheck(masterPasswordResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(masterPasswordResponse.rows)) {
    // socket.socketIO.emit('reset_device_password', {
    //     newPassword: masterPasswordResponse.rows[0]['master_password'],
    //     oldPassword: activePasswordResponse.rows[0]['active_password']
    // });
    // }
    return fennixResponse(statusCodeConstants.STATUS_DEVICE_UNLOCKED, 'EN_US', []);
};
const getContainerMapHistoryBusiness = async (req) => {
    let toDate = new Date(), fromDate = new Date(), startAddress = null, endAddress = null, request, response,
        finalResponse = {}, modifiedResponse = {}, mapResponseArray = [], geoFence = null, tripResponse, historyDetails;
    let tripLimit = notNullCheck(req.query.limit) ? req.query.limit : 5;
    let tripRequest = {
        containerId: parseInt(req.query.containerId),
        tripLimit: tripLimit
    };
    tripResponse = await tripAccessors.getActiveTripDetailsByContainerIdAccessor(tripRequest);
    let tripIds = [];
    if (arrayNotEmptyCheck(tripResponse)) {
        tripResponse.forEach((item) => tripIds.push(item['tripId']));
    }
    request = {
        containerId: parseInt(req.query.containerId),
        tripId: tripIds
    };
    response = await containerAccessors.getContainerMapHistoryAccessor(request);
    if (arrayNotEmptyCheck(response)) {
        mapResponseArray = response;
        // response.forEach((item) => {
        //     let obj = {
        //         containerId: item['trips'][0]['containerId'],
        //         latitude: item['trips'][0]['latitude'],
        //         longitude: item['trips'][0]['longitude'],
        //         deviceDate: item['trips'][0]['deviceDate'],
        //         locationId: item['trips'][0]['_id'],
        //         tripId: item['_id'],
        //         speed: item['trips'][0]['speed']
        //     };
        //     mapResponseArray.push(obj);
        // });
        if (arrayNotEmptyCheck(tripResponse)) {
            startAddress = tripResponse[0]['startAddress'];
            endAddress = tripResponse[0]['endAddress'];
            historyDetails = tripResponse[0];
            geoFence = {
                lat: tripResponse[0]['latArray'],
                lng: tripResponse[0]['lngArray']
            };
        }
        modifiedResponse = {
            startAddress,
            endAddress,
            geoFence,
            historyDetails,
            mapHistory: mapResponseArray
        };
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DEVICES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};
const getTripDuration = (dateTime, timeFlag) => {
    let startTime = dateTime.startTime, endTime = dateTime.endTime, startDate = new Date(dateTime.startDate),
        endDate = new Date(dateTime.endDate);
    if (timeFlag) {
        startTime = timeHoursToMillisecondConverter(startTime);
        endTime = timeHoursToMillisecondConverter(endTime);
        startDate.setTime(startTime);
        endDate.setTime(endTime);
    }
    return Math.abs(startDate.getTime() - endDate.getTime());
};

const getDateTimeStamp = (date, time) => {
    let timeInMilliSeconds = timeHoursToMillisecondConverter(time), actualDate = new Date(date);
    actualDate.setTime(timeInMilliSeconds);
    console.log('actual time');
    console.log(actualDate);
    return actualDate;
};
const timeHoursToMillisecondConverter = (time) => {
    let splitTime = time.split(':');
    return ((splitTime[0] * (60000 * 60)) + (splitTime[1] * 60000));
};
const containerMapDataListWithFiltersBusiness = async (req) => {
    let request = {
            sortBy: req.body.sort,
            offset: parseInt(req.body.skip),
            limit: parseInt(req.body.limit),
            languageId: req.body.languageId
        },
        containerReturnObj = {}, gridData = {}, locationObj = {}, totalNoOfRecords,
        containerDevices = {}, containerListResponse, returnObj, userResponse, userRequest;
    userRequest = {query: {userId: req.body.userId, languageId: req.body.languageId}};
    console.log(userRequest);
    userResponse = await userAccessors.getUserIdsForAllRolesAccessor(userRequest, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
    console.log(userResponse);
    request.userIdList = userResponse.userIdsList;
    request.nativeUserRole = userResponse.nativeUserRole;
    let keysArray = [], valuesArray = [];
    Object.keys(filtersMapping.containerFilters).forEach((key) => {
        if (objectHasPropertyCheck(req.body, key)) {
            keysArray.push(filtersMapping.containerFilters[key]);
            valuesArray.push(req.body[key]);
        }
    });
    request.keysArray = keysArray;
    request.valuesArray = valuesArray;
    containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
    console.log(containerListResponse);
    totalNoOfRecords = await containerAccessors.getTotalNoOfContainersForMapAccessor(request);
    console.log(totalNoOfRecords);
    if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
        let containerIdListAndDetailObj, containerDeviceArray;
        containerIdListAndDetailObj = containerListResponse.rows.reduce((init, item) => {
            init.containerIdArray.push(parseInt(item.container_id));
            init.containerDetailObj[item.container_id] = {
                containerId: item['container_id'],
                containerName: item['container_name'],
                documentId: item['document_id'],
                containerLockStatus: item['container_lock_status'],
                image: item['container_image']
            };
            return init;
        }, {containerIdArray: [], containerDetailObj: {}});
        containerDeviceArray = await deviceAccessors.deviceByContainerAccessor(containerIdListAndDetailObj.containerIdArray);
        console.log(containerDeviceArray);
        if (arrayNotEmptyCheck(containerDeviceArray)) {
            containerDeviceArray.forEach((item) => {
                locationObj[item.containerId] = {...containerIdListAndDetailObj['containerDetailObj'][item.containerId]};
                locationObj[item.containerId]['location'] = {
                    longitude: item.location.longitude,
                    latitude: item.location.latitude
                };
                containerIdListAndDetailObj['containerDetailObj'][item.containerId]['imei'] = item['device']['imei'];
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
                    text: 'GSM',
                    key: 'gsmQuality',
                    icon: 'signal_cellular_4_bar',
                    status: item.deviceAttributes.gsmQuality < 2 ? 'violation' : 'safe',
                    value: item.deviceAttributes.gsmQuality < 2 ? 'Low' : 'OK'
                });
                deviceDetails[item.containerId].push({
                    text: 'Mileage',
                    key: 'mileage',
                    icon: 'directions_car',
                    status: item.deviceAttributes.mileage === 0 ? 'violation' : 'safe',
                    value: item.deviceAttributes.mileage === 0 ? 'Outdoor' : 'Home'
                });
                deviceDetails[item.containerId].push({
                    text: 'SAT',
                    key: 'gpsQuality',
                    icon: 'gps_fixed',
                    status: item.deviceAttributes.gpsQuality === 'V' ? 'violation' : 'safe',
                    value: GPS[item.deviceAttributes.gpsQuality]
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
                const modifiedDate = `${completeDate.toLocaleDateString('es')} ${completeDate.toLocaleTimeString('es')}`;
                const serverDate = new Date(`${item.deviceAttributes.serverDate}`);
                const modifiedServerDate = `${serverDate.toLocaleDateString('es')} ${serverDate.toLocaleTimeString('es')}`;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceUpdatedDate'] = modifiedDate;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['serverDate'] = modifiedServerDate;
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['deviceDetails'] = deviceDetails[item.containerId];
                containerIdListAndDetailObj.containerDetailObj[item.containerId]['noOfViolations'] = {
                    text: 'Number of Violations',
                    value: noOfViolations
                };
                locationObj[item.containerId]['noOfViolations'] = noOfViolations;
                gridData[item.containerId] = {...containerIdListAndDetailObj.containerDetailObj[item.containerId]};
            });
        }
        containerReturnObj['markers'] = Object.keys(locationObj).map(key => locationObj[key]);
        containerReturnObj['deviceDetails'] = containerDevices;
        containerReturnObj['deviceDetailsArray'] = Object.keys(containerDevices).map((device) => containerDevices[device]);
        containerReturnObj['gridData'] = Object.keys(gridData).map(data => gridData[data]);
        containerReturnObj['markerDetails'] = gridData;
        containerReturnObj['totalNoOfRecords'] = objectHasPropertyCheck(totalNoOfRecords, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(totalNoOfRecords.rows) ? totalNoOfRecords.rows[0]['count'] : 0;
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
    unlockElockBusiness,
    editContainerBusiness,
    getContainerMapHistoryBusiness,
    containerMapDataListBusiness,
    containerMapDataListWithFiltersBusiness,
    uploadBeneficiaryDocumentsBusiness
};


// const fetchTripDetailsBusiness = async (req) => {
//     let userRequest = {query: {userId: req.query.userId, languageId: req.query.languageId}}, request = {},
//         containerListResponse,
//         mongoRequest = {status: ["IN_PROGRESS", "NOT_STARTED"], containerId: {$in: []}}, response,
//         tripResponse = {gridData: []};
//     let userResponse = await userAccessors.getUserIdsForAllRolesAccessor(userRequest, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
//     request.userIdList = userResponse.userIdsList;
//     request.nativeUserRole = userResponse.nativeUserRole;
//     containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
//     if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
//         containerListResponse.rows.forEach((item) => {
//             mongoRequest.containerId.$in.push(item['container_id']);
//         });
//         response = await containerAccessors.fetchTripDetailsAccessor(mongoRequest);
//         if (arrayNotEmptyCheck(response)) {
//             let formattedArray = [];
//             response.forEach((item) => {
//                 const obj = {
//                     tripId: item['tripId'],
//                     tripName: item['tripName'],
//                     tripStartAddress: item['startAddress']['name'],
//                     tripEndAddress: item['endAddress']['name'],
//                     tripStartTime: item['startDate'],
//                     tripEndTime: item['endDate'],
//                     tripStatus: getTripStatusName(item['tripStatus']),
//                     tripDuration: item['tripDuration'] ? item['tripDuration'] : '-',
//                     tripActualStartDateTime: item['actualStartDate'] ? item['actualStartDate'] : '-',
//                     tripActualEndDateTime: item['actualEndDate'] ? item['actualEndDate'] : '-',
//                     tripActualDuration: item['actualDuration'] ? item['actualDuration'] : '-'
//                 };
//                 formattedArray.push(obj);
//             });
//             tripResponse.gridData = formattedArray;
//             tripResponse.totalNoOfRecords = response.length;
//         }
//     }
//     return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', tripResponse);
// };
// const getTripStatusName = (tripStatus) => {
//     const tripStatusMap = {NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed'};
//     return tripStatusMap[tripStatus];
// };
// const endTripBusiness = async (req) => {
//     let response, notificationsResponse;
//     notificationsResponse = await containerAccessors.getNotificationEmailsForTripIdAccesssor({tripId: req.query.tripId});
//     if (notNullCheck(notificationsResponse)) {
//         let startDateTime = new Date(notificationsResponse[0]['tripActualStartTime']);
//         let endDateTime = new Date();
//         let tripDuration = Math.abs(endDateTime.getTime() - startDateTime.getTime());
//         containerAccessors.updateTripStatusAccessor({
//             tripId: req.query.tripId,
//             tripStatus: 'COMPLETED',
//             tripActualEndTime: endDateTime,
//             tripActualDuration: tripDuration
//         });
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail1, 'end_trip');
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail2, 'end_trip');
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail3, 'end_trip');
//     }
//     return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', '');
// };
// const fetchCompletedTripDetailsBusiness = async (req) => {
//     let userRequest = {query: {userId: req.query.userId, languageId: req.query.languageId}}, request = {},
//         mongoRequest = {status: ["COMPLETED"], containerId: {$in: []}},
//         tripResponse;
//     tripResponse = await commonFetchTripDetails(userRequest, mongoRequest, request);
//     return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', tripResponse);
// };
//
// const commonFetchTripDetails = async (userRequest, mongoRequest, request) => {
//     let containerListResponse, response, tripResponse = {gridData: []};
//     let userResponse = await userAccessors.getUserIdsForAllRolesAccessor(userRequest, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NATIVE_ROLE);
//     request.userIdList = userResponse.userIdsList;
//     request.nativeUserRole = userResponse.nativeUserRole;
//     containerListResponse = await containerAccessors.getContainerIdListAccessor(request);
//     if (objectHasPropertyCheck(containerListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(containerListResponse.rows)) {
//         containerListResponse.rows.forEach((item) => {
//             mongoRequest.containerId.$in.push(item['container_id']);
//         });
//         response = await containerAccessors.fetchTripDetailsAccessor(mongoRequest);
//         if (arrayNotEmptyCheck(response)) {
//             let formattedArray = [];
//             response.forEach((item) => {
//                 const obj = {
//                     tripId: item['tripId'],
//                     tripName: item['tripName'],
//                     tripStartAddress: item['startAddress']['name'],
//                     tripEndAddress: item['endAddress']['name'],
//                     tripStartTime: item['startDate'],
//                     tripEndTime: item['endDate'],
//                     tripStatus: getTripStatusName(item['tripStatus']),
//                     tripDuration: item['tripDuration'] ? item['tripDuration'] : '-',
//                     tripActualStartDateTime: item['actualStartDate'] ? item['actualStartDate'] : '-',
//                     tripActualEndDateTime: item['actualEndDate'] ? item['actualEndDate'] : '-',
//                     tripActualDuration: item['actualDuration'] ? item['actualDuration'] : '-'
//                 };
//                 formattedArray.push(obj);
//             });
//             tripResponse.gridData = formattedArray;
//             tripResponse.totalNoOfRecords = response.length;
//         }
//     }
//     return tripResponse;
// };
//
// const fetchTripDetailsBusiness = async (req) => {
//     let userRequest = {query: {userId: req.query.userId, languageId: req.query.languageId}}, request = {},
//         mongoRequest = {status: ["IN_PROGRESS", "NOT_STARTED"], containerId: {$in: []}},
//         tripResponse;
//     tripResponse = await commonFetchTripDetails(userRequest, mongoRequest, request);
//     return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', tripResponse);
// };
//
// const startTripBusiness = async (req) => {
//     let response, notificationsResponse;
//     notificationsResponse = await containerAccessors.getNotificationEmailsForTripIdAccesssor({tripId: req.query.tripId});
//     if (notNullCheck(notificationsResponse)) {
//         containerAccessors.setContainerLockStatusAccessor([parseInt(notificationsResponse[0].containerId), true]);
//         containerAccessors.updateTripStatusAccessor({
//             tripId: req.query.tripId,
//             tripStatus: 'IN_PROGRESS',
//             tripActualStartTime: new Date()
//         });
//         // activePasswordResponse[0]['active_password']
//         // const activePasswordResponse = await containerAccessors.getActivePasswordForContainerIdAccessor([notificationsResponse.containerId]);
//         // if (objectHasPropertyCheck(activePasswordResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(activePasswordResponse.rows)) {
//         socket.socketIO.emit('set_active_password', {
//             newPassword: '100000',
//             oldPassword: '100000'
//         });
//         // }
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail1, 'start_trip');
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail2, 'start_trip');
//         notificationEmailBusiness(notificationsResponse[0].notificationEmail3, 'start_trip');
//     }
//     return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', '');
// };

