const {getBenefeciaryAggregator, getBeneficiaryListByOwnerId, getBeneifciaryIdList} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {mapMarkerQuery} = require('../../repository-module/data-accesors/location-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {deviceBybeneficiaryQuery} = require('../../repository-module/data-accesors/device-accesor');

var beneficiaryAggregatorDashboard = async (req) => {
    let request = [req.query.userId], beneficiaryResponse, returnObj;
    beneficiaryResponse = await getBenefeciaryAggregator(request);
    if (objectHasPropertyCheck(beneficiaryResponse, 'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let beneficiaryObj = {
            VICTIM: {key: 'victim', value: '', color: '', legend: 'VICTIM'},
            OFFENDER: {key: 'offender', value: '', color: '', legend: 'OFFENDER'},
        };
        if (beneficiaryResponse.rows.length === 1) {
            let propName = beneficiaryResponse.rows[0]['role_name'];
            //TODO interchange victim and offender
            let propName2 = propName === 'VICTIM' ? 'VICTIM' : "OFFENDER";
            beneficiaryObj[propName]['value'] = beneficiaryResponse.rows[0]['count'];
            beneficiaryObj[propName2]['value'] = 0;
        } else {
            beneficiaryResponse.rows.forEach((item) => {
                item['role_name'] = item['role_name'] === 'VICTIM' ? 'OFFENDER' : "VICTIM";
                beneficiaryObj[item['role_name']]['value'] = item['count'];
            });
        }
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

var beneficiaryListByOwnerUserId = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, (req.body.currentPage * req.body.pageSize), req.body.pageSize],
        beneficiaryListResponse, returnObj;
    beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryObj = {};
        beneficiaryObj['headerArray'] = Object.keys(beneficiaryListResponse.rows[0]).map(item => item);
        beneficiaryObj['bodyArray'] = beneficiaryListResponse.rows;

        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

const beneficiaryLocationListByOwnerAndCenter = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, (req.body.pagination.currentPage * req.body.pagination.pageSize), req.body.pagination.pageSize],
        beneficiaryIdListResponse, returnObj;
    beneficiaryIdListResponse = await getBeneifciaryIdList(request);
    if (objectHasPropertyCheck(beneficiaryIdListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryIdListResponse.rows)) {
        let beneficiaryIdListAndDetailObj, beneficiaryLocArray;
        beneficiaryIdListAndDetailObj = beneficiaryIdListResponse.rows.reduce((init, item) => {
            init.beneficiaryIdArray.push(`${item.beneficiaryid}`);
            init.beneficiaryDetailObj[item.beneficiaryid] = item;
            return init;
        }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
        beneficiaryLocArray = await  mapMarkerQuery(beneficiaryIdListAndDetailObj.beneficiaryIdArray);
        const beneficiaryFliter = {};
        beneficiaryLocArray.forEach((item) => {
            beneficiaryFliter[item.latestBeneficiaryLocation.beneficiaryId] = beneficiaryIdListAndDetailObj['beneficiaryDetailObj'][item.latestBeneficiaryLocation.beneficiaryId];
            beneficiaryFliter[item.latestBeneficiaryLocation.beneficiaryId]['location'] = {
                latitude: item.latestBeneficiaryLocation.latitude,
                longitude: item.latestBeneficiaryLocation.longitude
            };
        });
        const beneficiaryMapArray = Object.keys(beneficiaryFliter)
            .map((marker) => beneficiaryFliter[marker]);
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryMapArray);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
const beneficiaryMapDataList = async (req) => {
    let request = [req.body.userId, req.body.centerId, req.body.sort, (req.body.pagination.currentPage * req.body.pagination.pageSize), req.body.pagination.pageSize],
        beneficiaryListResponse, returnObj;
    beneficiaryListResponse = await getBeneifciaryIdList(request);
    if (objectHasPropertyCheck(beneficiaryListResponse, 'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryIdListAndDetailObj, beneficiaryDeviceArray;
        beneficiaryIdListAndDetailObj = beneficiaryListResponse.rows.reduce((init, item) => {
            init.beneficiaryIdArray.push(`${item.beneficiaryid}`);
            init.beneficiaryDetailObj[item.beneficiaryid] = item;
            return init;
        }, {beneficiaryIdArray: [], beneficiaryDetailObj: {}});
        const beneficiaryFinalObj = {};
        const beneficiaryDeviceFinalObj = {};
        beneficiaryDeviceArray = await deviceBybeneficiaryQuery(beneficiaryIdListAndDetailObj.beneficiaryIdArray);
        let beneficiaryObj = {};
        beneficiaryDeviceArray.forEach((item, index) => {
            const deviceDetails = {};
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId] = [];
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Percentage',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Battery Voltage',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.batteryVoltage
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Belt Status',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.beltStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Shell Status',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.shellStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'GPS Status',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.gpsStatus
            });
            deviceDetails[item.latestBeneficiaryDeviceDetails.beneficiaryId].push({
                text: 'Speed',
                value: item.latestBeneficiaryDeviceDetails.deviceAttributes.locationDetails.speed
            });
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId] = {};
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['beneficiaryId'] = {
                text: item.latestBeneficiaryDeviceDetails.beneficiaryId,
                type: 'text'
            };
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['firstname'] = {
                text: beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['firstname'],
                type: 'text'
            };
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['imei'] = {
                text: item.latestBeneficiaryDeviceDetails.imei === '' ? `456723${item.latestBeneficiaryDeviceDetails.beneficiaryId}${index}` : item.latestBeneficiaryDeviceDetails.imei,
                type: 'text'
            };
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['mobileno'] = {
                text: beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['mobileno'],
                type: 'text'
            };
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['updatedDate'] = {
                text: beneficiaryIdListAndDetailObj.beneficiaryDetailObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['device_updated_date'],
                type: 'text'
            };
            beneficiaryFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['viewDetails'] = {
                text: 'View Details',
                type: 'link',
                id: item.latestBeneficiaryDeviceDetails.beneficiaryId
            };
            beneficiaryDeviceFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId] = {};
            beneficiaryDeviceFinalObj[item.latestBeneficiaryDeviceDetails.beneficiaryId]['deviceDetails'] = deviceDetails;
        });
        beneficiaryObj['headerArray'] = [{
            headerName: 'Beneficiary Id',
            key: 'beneficiaryId',
            type: 'text'
        }, {headerName: 'Name', key: 'firstName', type: 'text'}, {
            headerName: 'IMEI',
            key: 'imei',
            type: 'text'
        }, {headerName: 'Mobile No.', key: 'mobileno', type: 'text'}, {
            headerName: 'Updated Date',
            key: 'updatedDate',
            type: 'text'
        }, {headerName: 'View Details', key: 'viewDetails', type: 'link'}];
        beneficiaryObj['bodyArray'] = Object.keys(beneficiaryFinalObj).map((item) => beneficiaryFinalObj[item]);
        beneficiaryObj['deviceObj'] = beneficiaryDeviceFinalObj;
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};
module.exports = {
    beneficiaryAggregatorDashboard,
    beneficiaryListByOwnerUserId,
    beneficiaryMapDataList,
    beneficiaryLocationListByOwnerAndCenter
};
