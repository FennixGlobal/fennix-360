const beneficiaryAccessor = require('../../repository-module/data-accesors/beneficiary-accesor');
const {objectHasPropertyCheck, deviceStatusMapper, arrayNotEmptyCheck, notNullCheck, responseObjectCreator} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/response-status-constants/status-code-constants');
const {deviceByBeneficiaryIdAccessor} = require('../../repository-module/data-accesors/device-accesor');
const {getBeneficiaryMapHistoryAccessor} = require('../../repository-module/data-accesors/location-accesor');
const restrictionAccessor = require('../../repository-module/data-accesors/restriction-accesor');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');

const beneficiaryTrackMapBusiness = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, parseInt(req.body.skip), req.body.limit, req.body.languageId],
        beneficiaryReturnObj = {}, gridData = {}, locationObj = {},
        beneficiaryDevices = {}, beneficiaryListResponse, returnObj,
        newReq = {
            query: {
                userId: req.body.userId,
                centerId: req.body.centerId,
                sort: req.body.sort,
                skip: parseInt(req.body.skip),
                limit: parseInt(req.body.limit),
                languageId: req.body.languageId
            }
        };
    beneficiaryListResponse = await beneficiaryAccessor.getBeneifciaryIdList(newReq);
    if (objectHasPropertyCheck(beneficiaryListResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryIdListAndDetailObj, beneficiaryDeviceArray;
        beneficiaryIdListAndDetailObj = beneficiaryListResponse.rows.reduce((init, item) => {
            init.beneficiaryIdArray.push(parseInt(item.beneficiaryid));
            init.beneficiaryDetailObj[item.beneficiaryid] =
                responseObjectCreator(item, ['beneficiaryId', 'firstName', 'documentId', 'mobileNo', 'image', 'emailId', 'beneficiaryRoleId', 'gender'], ['beneficiaryid', 'firstname', 'document_id', 'mobileno', 'image', 'emailid', 'role_id', 'gender'])
            return init;
        }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
        beneficiaryDeviceArray = await deviceByBeneficiaryIdAccessor(beneficiaryIdListAndDetailObj.beneficiaryIdArray);
        if (arrayNotEmptyCheck(beneficiaryDeviceArray)) {
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
        }
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

const getBeneficiaryMapHistoryBusiness = async (req) => {
    let toDate = new Date(), fromDate = new Date(), request,
        finalResponse = {}, modifiedResponse = {}, mapResponseArray = [], geoFence, geoFenceDetails, historyDetails;
    if (notNullCheck(req.query.dateRange)) {
        switch (req.query.dateRange) {
            case '1hr':
                fromDate.setTime(toDate.getTime() - 1);
                break;
            case '2hr':
                fromDate.setTime(toDate.getTime() - 2);
                break;
            case '5hr':
                fromDate.setTime(toDate.getTime() - 5);
                break;
            case '1day':
                fromDate.setDate(toDate.getDate() - 1);
                break;
            case '2day':
                fromDate.setDate(toDate.getDate() - 2);
                break;
            case '7day':
                fromDate.setDate(toDate.getDate() - 7);
                break;
            default:
                fromDate.setDate(toDate.getDate() - 10);
        }
    } else {
        fromDate.setDate(toDate.getDate() - 1);
    }
    request = {
        toDate: toDate.toISOString(),
        fromDate: fromDate.toISOString(),
        beneficiaryId: parseInt(req.query.beneficiaryId)
    };
    historyDetails = await getBeneficiaryMapHistoryAccessor(request);
    geoFenceDetails = await restrictionAccessor.fetchLocationRestrictionAccessor(req.query.beneficiaryId);
    if (arrayNotEmptyCheck(historyDetails)) {
        // console.log(historyDetails);
        historyDetails.forEach((item) => {
            let obj = {
                beneficiaryId: item['beneficiaryId'],
                latitude: item['latitude'],
                longitude: item['longitude'],
                deviceDate: item['deviceDate'],
                locationId: item['_id'],
                speed: item['speed']
            };
            mapResponseArray.push(obj);
        });
        if (arrayNotEmptyCheck(geoFenceDetails) && objectHasPropertyCheck(geoFenceDetails, 'latArray') && objectHasPropertyCheck(geoFenceDetails, 'lngArray')) {
            geoFence = {
                lat: geoFenceDetails[0]['latArray'],
                lng: geoFenceDetails[0]['lngArray']
            };
        }
        modifiedResponse = {
            geoFence: geoFence,
            mapHistory: mapResponseArray
        };
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_LOCATION_EXISTS_FOR_GIVEN_ID, 'EN_US', []);
    }
    return finalResponse;
};

module.exports = {
    beneficiaryTrackMapBusiness,
    getBeneficiaryMapHistoryBusiness
};