const {arrayNotEmptyCheck, notNullCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
const {deviceCommandConstants} = require('../../util-module/device-command-constants');
const locationAccessor = require('../../repository-module/data-accesors/location-accesor');
const deviceAccessor = require('../../repository-module/data-accesors/device-accesor');
const containerAccessor = require('../../repository-module/data-accesors/container-accessor');
const {deviceValidator} = require('../../util-module/device-validations');
const cronJob = require('cron').CronJob;

let locationObj = {}, deviceObj = {};
const locationUpdateBusiness = async (data) => {
    let returnString = '';
    if (data.indexOf(deviceCommandConstants.cmdLogin) !== -1) {  // '#SA'
        returnString = processData(data);
    } else if (data.indexOf(deviceCommandConstants.cmdLocationReport) !== -1) {  // '#RD

        await processLocation(data);
    }
    return returnString;
};

const processData = (loginString) => {
    let returnString, loginFlag;
    const checkSum = 3;
    const dataCommand = loginString.substr(0, 3);
    locationObj = {
        connectionSession: loginString.substr(3, 6),
        serialNumber: loginString.substr(9, 5),
    };
    const loginHome = dataCommand.length + locationObj.connectionSession.length + locationObj.serialNumber.length + loginString.substr(14, 15).length;
    deviceObj = {
        imei: loginString.substr(14, 15),
        firmwareVersion: loginString.substr(loginHome, (loginString.length - 1) - (loginHome - 1) - checkSum)
    };
    loginFlag = processLogin(loginString.substr(14, 15));
    returnString = loginFlag ? loginString.replace(loginString.substr(0, 3), deviceCommandConstants.cmdLoginResponse) : loginString; // '#SB'
    return returnString;
};
const getBeneficiaryMapHistoryBusiness = async (req) => {
    let request = {
        toDate: new Date(req.query.toDate).toISOString(),
        fromDate: new Date(req.query.fromDate).toISOString(),
        beneficiaryId: parseInt(req.query.beneficiaryId)
    }, response, finalResponse = {}, modifiedResponse = [];
    response = await deviceAccessor.getBeneficiaryIdByImeiAccessor(request);
    if (arrayNotEmptyCheck(response)) {
        response.forEach((item) => {
            let obj = {
                beneficiaryId: item['beneficiaryId'],
                latitude: item['latitude'],
                longitude: item['longitude'],
                deviceDate: item['deviceDate'],
                locationId: item['_id']
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_LOCATION_EXISTS_FOR_GIVEN_ID, 'EN_US', []);
    }
    return finalResponse;
};

const processLocation = async (location) => {
    let ticketResponse;
    let locationObj = {}, latitude, longitude;
    const NudosToKm = 1.852;
    const direction = 6;
    let day = location.substr(29, 2);
    let month = parseInt(location.substr(31, 2)) - 1;
    let year = `20${location.substr(33, 2)}`;
    let hours = location.substr(35, 2);
    let minutes = location.substr(37, 2);
    let seconds = location.substr(39, 2);
    let dateTime = new Date(year, month, day, hours, minutes, seconds);
    let beneficiaryResponse = await deviceAccessor.getBeneficiaryIdByImeiAccessor(parseInt(location.substr(14, 15)));
    if (arrayNotEmptyCheck(beneficiaryResponse) && notNullCheck(beneficiaryResponse[0]) && notNullCheck(beneficiaryResponse[0]['beneficiaryId'])) {
        let masterRequest = {
            deviceId: parseInt(beneficiaryResponse[0]['_id']),
            beneficiaryId: parseInt(beneficiaryResponse[0]['beneficiaryId'])
        };
        const vel = location.substr(62, 5);
        let deviceAttribute = {
            beneficiaryId: parseInt(beneficiaryResponse[0]['beneficiaryId']),
            serialNumber: location.substr(9, 5),
            hdop: location.substr(99, 2),
            cellId: location.substr(108, 4),
            mcc: location.substr(101, 3),
            lac: location.substr(104, 4),
            serverDate: new Date(),
            speed: ((parseInt(vel.substr(0, 3), 10) + parseFloat(vel.substr(4, 1)) / 10) * NudosToKm).toFixed(2),
            course: parseInt(location.substr(67, 2)) * direction,
            moveDistance: parseInt(location.substr(69, 5)),
            gpsStatus: location.substr(74, 1),
            alarmStatus: location.substr(75, 21),
            ...alarmStatusDeCompiler(location.substr(75, 21)),
            satellitesNumber: location.substr(96, 2),
            deviceUpdatedDate: dateTime,
            gpsFixedStatus: location.substr(98, 1)
        };
        let lat = location.substr(41, 10);
        let signLat = lat.indexOf('N') !== -1 ? 1 : -1;
        latitude = signLat * getValue(lat.substr(0, 2), lat.substr(2, 2), lat.substr(5, 4));
        let lng = location.substr(51, 11);
        let signLng = lng.indexOf('E') !== -1 ? 1 : -1;
        longitude = signLng * getValue(lng.substr(0, 3), lng.substr(3, 2), lng.substr(6, 4));
        locationObj = {
            longitude: longitude,
            latitude: latitude,
            beneficiaryId: parseInt(beneficiaryResponse[0]['beneficiaryId']),
            deviceDate: dateTime
        };
        const locationId = await locationAccessor.updateLocation(locationObj);
        ticketResponse = deviceValidator(deviceAttribute, masterRequest.beneficiaryId, locationObj);
        // console.log(ticketResponse);
        // if (notNullCheck(ticketResponse)) {
        //     addAutomatedTicketBusiness(ticketResponse, masterRequest.beneficiaryId);
        // }
        deviceAttribute = {...deviceAttribute, locationId: locationId['_doc']['counter']};
        const deviceAttributeId = await deviceAccessor.updateDeviceAttributesAccessor(deviceAttribute);
        masterRequest = {
            ...masterRequest,
            locationId: parseInt(locationId['_doc']['counter']),
            deviceAttributeId: parseInt(deviceAttributeId['_doc']['counter'])
        };
        await deviceAccessor.updateLocationDeviceAttributeMasterAccessor(masterRequest).then((doc) => {
            // console.log(doc)
        });
    }
};

processLogin = async (imei) => {
    let returnFlag, beneficiaryResponse = await deviceAccessor.getBeneficiaryIdByImeiAccessor(parseInt(imei));
    console.log('Beneficiary details:');
    console.log(beneficiaryResponse);
    returnFlag = arrayNotEmptyCheck(beneficiaryResponse);
    return returnFlag;
};

const getValue = (intPart, decimalPart1, decimalPart2) => {
    let ret = 0;
    ret = parseFloat(intPart);
    ret += parseFloat(decimalPart1) / 60;
    ret += parseFloat(decimalPart2) / (60 * 10000);
    return ret;
};

const alarmStatusDeCompiler = (alarmStatus) => {
    return {
        beltStatus: alarmStatus.substr(0, 1),
        shellStatus: alarmStatus.substr(1, 1),
        gsmSignal: getGSMLevel(parseInt(alarmStatus.substr(2, 2))),
        batteryVoltage: (parseInt(alarmStatus.substr(4, 1)) + (parseInt(alarmStatus.substr(5, 2)) / 100)).toFixed(2),
        batteryPercentage: batteryPercentCalculator(parseInt(alarmStatus.substr(4, 1)) + (parseInt(alarmStatus.substr(5, 2)) / 100)).toFixed(2),
        chargeStatus: alarmStatus.substr(7, 1),
        lowPowerStatus: alarmStatus.substr(8, 1),
        dataLoggerStatus: alarmStatus.substr(9, 1),
        stillStatus: alarmStatus.substr(10, 1),
        enableAlarmsStatus: parseInt(alarmStatus.substr(11, 1)) === 1,
        buzzerStatus: parseInt(alarmStatus.substr(12, 1)) === 1,
        vibratorStatus: parseInt(alarmStatus.substr(13, 1)) === 1,
        rfConnectionStatus: alarmStatus.substr(14, 1),
        rfgSensorStatus: alarmStatus.substr(15, 1),
        rfPlugStatus: alarmStatus.substr(16, 1)
    };
};

const batteryPercentCalculator = (batteryVoltage) => {
    const perc = [0, 9, 15, 20, 100];
    const volts = [3.4, 3.46, 3.55, 3.6, 4.1];
    let ret = 0, dvRange, dvMeasure, dpRange, vSelected = 0;
    for (let v = 0; v < volts.length; v++) {
        if (batteryVoltage > volts[v]) {
            vSelected = v;
        } else {
            break;
        }
    }
    if (vSelected === 0) {
        ret = 0;
    } else if (vSelected > 0 && vSelected < volts.length - 1) {
        dvRange = volts[vSelected + 1] - volts[vSelected];
        dvMeasure = batteryVoltage - volts[vSelected];
        dpRange = perc[vSelected + 1] - perc[vSelected];
        ret = perc[vSelected] + ((dvMeasure * dpRange) / dvRange);
    }
    else if (vSelected === (volts.length - 1)) {
        ret = 100;
    }
    return ret;
};

const getGSMLevel = (gsmStatus) => {
    let gsmLevel;
    if (gsmStatus < 4 || gsmStatus === 99) {
        gsmLevel = 0;
    } else if (4 < gsmStatus < 10) {
        gsmLevel = 1;
    } else if (10 < gsmStatus < 16) {
        gsmLevel = 2;
    } else if (16 < gsmStatus < 22) {
        gsmLevel = 3;
    } else if (22 < gsmStatus < 28) {
        gsmLevel = 4;
    } else if (28 < gsmStatus) {
        gsmLevel = 5;
    }
    return gsmLevel;
};

const dataSplitter = async (data, locationPrimaryId, elockDeviceAttributeId) => {
    let deviceIMEIId, datalength, containerId, deviceId, deviceAlertInfo, deviceType, protocol, deviceStatus,
        deviceUpdatedDate,
        returnString = '',
        location = null, response = null,
        deviceAttributes = null;
    deviceAlertInfo = hexToBinary(data.slice(72, 76));
    deviceIMEIId = data.slice(2, 12);//device Id
    protocol = data.slice(12, 14);// 17 being the protocol
    deviceType = data.slice(14, 15);// 1 being rechargeable
    deviceStatus = data.slice(15, 16);// data type
    datalength = data.slice(16, 20);
    let processedLoc = {
        latitude: degreeConverter(data.slice(32, 40), hexToBinary(data.slice(49, 50))),
        longitude: degreeConverter(data.slice(40, 49), hexToBinary(data.slice(49, 50)))
    };
    if (processedLoc.longitude.loc !== 0 && processedLoc.latitude.loc !== 0) {
        deviceUpdatedDate = new Date(parseInt(`20${data.slice(24, 26)}`, 10), (parseInt(data.slice(22, 24)) - 1), data.slice(20, 22), data.slice(26, 28), data.slice(28, 30), data.slice(30, 32));// date
        const containerResponse = await deviceAccessor.getContainerIdByImeiAccessor(parseInt(deviceIMEIId, 10));
        if (arrayNotEmptyCheck(containerResponse)) {
            containerId = containerResponse[0]['containerId'];
            deviceId = containerResponse[0]['_id'];
            location = {
                containerId: containerId,
                deviceId: deviceId,
                _id: locationPrimaryId,
                deviceDate: deviceUpdatedDate,
                latitude: processedLoc.latitude.loc,
                latitudeDirection: processedLoc.latitude.locCode,
                longitude: processedLoc.longitude.loc,
                longitudeDirection: processedLoc.longitude.locCode
            };
            deviceAttributes = {
                containerId: containerId,
                deviceId: deviceId,
                _id: elockDeviceAttributeId,
                locationId: locationPrimaryId,
                gps: data.slice(49, 50),
                speed: data.slice(50, 52),
                direction: data.slice(52, 54),
                mileage: data.slice(54, 62),
                gpsQuality: data.slice(62, 64),
                vehicleId: data.slice(64, 72),
                deviceStatus: deviceAlertInfo.returnValue,
                serverDate: new Date(),
                deviceUpdatedDate: deviceUpdatedDate,
                batteryPercentage: eLockBatteryPercentCalculator(data.slice(76, 78)),
                cellId: data.slice(78, 82),
                lac: data.slice(82, 86),
                gsmQuality: data.slice(86, 88),
                geoFenceAlarm: data.slice(88, 90)
            };
            if (deviceAlertInfo.flag && deviceAlertInfo.returnValue && deviceAlertInfo.returnValue.split('')[14] === '1') {
                returnString = '(P35)';
            }
            response = {};
            response['deviceId'] = deviceId;
            response['containerId'] = containerId;
            response['location'] = location;
            response['deviceAttributes'] = deviceAttributes;
            response['returnString'] = returnString;
        }
    }
    return response;
};

const eLockBatteryPercentCalculator = (hexValue) => {
    let batteryPercent = 0, decimalValue;
    decimalValue = parseInt(hexValue, 16);
    if (decimalValue !== 255 && decimalValue > 100) {
        batteryPercent = 100;
    } else {
        batteryPercent = decimalValue;
    }
    return batteryPercent;
};
const eLocksDataUpdateBusiness = async (data) => {
    let returnString = '', updateLoc, deviceId, containerId, updateDevice, returnArray, locationList = [],
        deviceAttributesList = [], masterData = {},
        dataSplitterResponse = null;
    const eLockStatus = data.slice(0, 2);
    switch (parseInt(eLockStatus, 10)) {
        case 24:
            returnArray = await dataIterator(data, null);
            break;
        case 28:
            returnString = '(P46)';
            break;
    }
    if (objectHasPropertyCheck(returnArray, 'gps') && arrayNotEmptyCheck(returnArray.gps)) {
        const locationPrimaryKeyResponse = await containerAccessor.fetchNextLocationPrimaryKeyAccessor();
        const eLockAttributesPrimaryKeyResponse = await containerAccessor.fetchNextDeviceAttributesPrimaryKeyAccessor();
        let locationPrimaryId = parseInt(locationPrimaryKeyResponse[0]['counter']) + 1;
        let finalLocCount = locationPrimaryId + returnArray.gps.length;
        await containerAccessor.updateNextLocationPrimaryKeyAccessor(finalLocCount + 1);
        let eLockAttributeId = parseInt(eLockAttributesPrimaryKeyResponse[0]['counter']) + 1;
        let finalELockAttrCount = eLockAttributeId + returnArray.gps.length;
        await containerAccessor.updateNextDeviceAttributesPrimaryKeyAccessor(finalELockAttrCount + 1);
        await asyncForEach(returnArray.gps, async (data) => {
            locationPrimaryId++;
            eLockAttributeId++;
            dataSplitterResponse = await dataSplitter(data, locationPrimaryId, eLockAttributeId);
            if (notNullCheck(dataSplitterResponse)) {
                if (notNullCheck(dataSplitterResponse['location'])) {
                    locationList.push(dataSplitterResponse['location']);
                }
                masterData = {
                    deviceId: dataSplitterResponse['deviceId'],
                    containerId: dataSplitterResponse['containerId']
                };
                deviceId = deviceId || (dataSplitterResponse ? dataSplitterResponse['deviceId'] : null);
                containerId = containerId || (dataSplitterResponse ? dataSplitterResponse['containerId'] : null);
                returnString = returnString || objectHasPropertyCheck(dataSplitterResponse, 'returnString') ? dataSplitterResponse['returnString'] : null;
                if (notNullCheck(dataSplitterResponse['deviceAttributes'])) {
                    deviceAttributesList.push(dataSplitterResponse['deviceAttributes']);
                }
            }
        });
        let finalLocationId, finalDeviceAttrId;
        if (arrayNotEmptyCheck(locationList)) {
            finalLocationId = locationList[locationList.length - 1]['_id'];
            updateLoc = await containerAccessor.containerLocationUpdateAccessor(locationList);
        }
        if (arrayNotEmptyCheck(deviceAttributesList)) {
            finalDeviceAttrId = deviceAttributesList[deviceAttributesList.length - 1]['_id'];
            updateDevice = await containerAccessor.containerDeviceAttributesUpdateAccessor(deviceAttributesList);
        }
        masterData = {
            ...masterData,
            locationId: finalLocationId,
            eLockAttributeId: finalDeviceAttrId
        };
    }
    await containerAccessor.updateElocksLocationDeviceAttributeMasterAccessor(masterData);
    // console.log('+++++++++++++++++++++return string++++++++++++++++++++++++');
    // console.log(returnString);
    return returnString;
};

//To insert dumped data to actual collections(elocksLocation & elocksDeviceAttributes)  & delete the dump from elocksDumpData
const newJob = new cronJob('* 2 * * *', async () => {
    await eLocksDataDumpToMasterInsertBusiness();
});
newJob.start();
const eLocksDataDumpToMasterInsertBusiness = async () => {
    let dumpDataResponse, locationList = [], deviceAttributesList = [], sortedDumpIdList = [],
        masterLocationDeviceAttrObj;
    dumpDataResponse = await containerAccessor.getSortedDumpDataAccessor();
    if (arrayNotEmptyCheck(dumpDataResponse)) {
        const locationPrimaryKeyResponse = await containerAccessor.fetchNextLocationPrimaryKeyAccessor();
        const eLockAttributesPrimaryKeyResponse = await containerAccessor.fetchNextDeviceAttributesPrimaryKeyAccessor();
        let locationPrimaryId = parseInt(locationPrimaryKeyResponse[0]['counter']) + 1;
        let eLockAttributeId = parseInt(eLockAttributesPrimaryKeyResponse[0]['counter']) + 1;
        dumpDataResponse.forEach((item) => {
            let locationObj = {
                _id: locationPrimaryId,
                containerId: item['containerId'],
                deviceId: item['deviceId'],
                deviceDate: item['deviceDate'],
                latitude: item['latitude'],
                latitudeDirection: processedLoc.latitude.locCode,
                longitude: processedLoc.longitude.loc,
                longitudeDirection: processedLoc.longitude.locCode,
            };
            let deviceAttributesObj = {
                _id: eLockAttributeId,
                containerId: item['containerId'],
                deviceId: item['deviceId'],
                locationId: locationPrimaryId,
                gps: item['gps'],
                speed: item['speed'],
                direction: item['direction'],
                mileage: item['mileage'],
                gpsQuality: item['gpsQuality'],
                vehicleId: item['vehicleId'],
                deviceStatus: item['deviceStatus'],
                serverDate: item['serverDate'],
                deviceUpdatedDate: item['deviceDate'],
                batteryPercentage: item['batteryPercentage'],
                cellId: item['cellId'],
                lac: item['lac'],
                gsmQuality: item['gsmQuality'],
                geoFenceAlarm: item['geoFenceAlarm']
            };
            sortedDumpIdList.push(`ObjectId(${item['_id']})`);
            locationPrimaryId++;
            eLockAttributeId++;
            locationList.push(locationObj);
            deviceAttributesList.push(deviceAttributesObj);
        });
        let latestData = locationList.pop();
        masterLocationDeviceAttrObj = {
            containerId: latestData['containerId'],
            deviceId: latestData['deviceId'],
            locationId: locationPrimaryId,
            deviceAttributeId: eLockAttributeId,
        };
        await containerAccessor.deleteSortedDumpDataAccessor(sortedDumpIdList);
        await containerAccessor.updateNextLocationPrimaryKeyAccessor(locationPrimaryId);
        await containerAccessor.updateNextDeviceAttributesPrimaryKeyAccessor(eLockAttributeId);
        await containerAccessor.updateElocksLocationDeviceAttributeMasterAccessor(masterLocationDeviceAttrObj);
        await containerAccessor.containerLocationUpdateAccessor(locationList);
        await containerAccessor.containerDeviceAttributesUpdateAccessor(deviceAttributesList);
    }
};

const dataSplitterDump = async (data, masterDate) => {
    let deviceIMEIId, datalength, dumpData, containerId, deviceId, deviceAlertInfo, deviceType, protocol, deviceStatus,
        deviceUpdatedDate,
        returnString = '',
        response = {};
    deviceAlertInfo = hexToBinary(data.slice(72, 76));
    deviceIMEIId = data.slice(2, 12);//device Id
    protocol = data.slice(12, 14);// 17 being the protocol
    deviceType = data.slice(14, 15);// 1 being rechargeable
    deviceStatus = data.slice(15, 16);// data type
    datalength = data.slice(16, 20);
    deviceUpdatedDate = new Date(parseInt(`20${data.slice(24, 26)}`, 10), (parseInt(data.slice(22, 24)) - 1), data.slice(20, 22), data.slice(26, 28), data.slice(28, 30), data.slice(30, 32));// date
    if (deviceUpdatedDate > masterDate) {
        const containerResponse = await deviceAccessor.getContainerIdByImeiAccessor(parseInt(deviceIMEIId, 10));
        if (arrayNotEmptyCheck(containerResponse)) {
            containerId = containerResponse[0]['containerId'];
            deviceId = containerResponse[0]['_id'];
            let processedLoc = {
                latitude: degreeConverter(data.slice(32, 40), hexToBinary(data.slice(49, 50))),
                longitude: degreeConverter(data.slice(40, 49), hexToBinary(data.slice(49, 50)))
            };
            dumpData = {
                containerId: containerId,
                deviceId: deviceId,
                deviceDate: deviceUpdatedDate,
                latitude: processedLoc.latitude.loc,
                latitudeDirection: processedLoc.latitude.locCode,
                longitude: processedLoc.longitude.loc,
                longitudeDirection: processedLoc.longitude.locCode,
                gps: data.slice(49, 50),
                speed: data.slice(50, 52),
                direction: data.slice(52, 54),
                mileage: data.slice(54, 62),
                gpsQuality: data.slice(62, 64),
                vehicleId: data.slice(64, 72),
                deviceStatus: deviceAlertInfo.returnValue,
                serverDate: new Date(),
                deviceUpdatedDate: deviceUpdatedDate,
                batteryPercentage: eLockBatteryPercentCalculator(data.slice(76, 78)),
                cellId: data.slice(78, 82),
                lac: data.slice(82, 86),
                gsmQuality: data.slice(86, 88),
                geoFenceAlarm: data.slice(88, 90)
            };
            if (deviceAlertInfo.flag && deviceAlertInfo.returnValue && deviceAlertInfo.returnValue.split('')[14] === '1') {
                returnString = '(P35)';
            }
            response['deviceId'] = deviceId;
            response['containerId'] = containerId;
            response['returnString'] = returnString;
            response['dumpData'] = dumpData;
        }
    }
    return response;
};
//This method is used to insert elocks data obtained from device into elocksDumpData collection
// and updating elocksMasterDump collection with the latest dump date
const eLocksDataUpdateDumpBusiness = async (data) => {
    let returnString = '', updateLoc, deviceId, containerId, updateDevice, returnArray,
        dumpDataList = [], masterDateResponse = {}, masterDate,
        dataSplitterResponse = null, response;
    const eLockStatus = data.slice(0, 2);
    switch (parseInt(eLockStatus, 10)) {
        case 24:
            returnArray = await dataIterator(data, null);
            break;
        case 28:
            returnString = 'P45';
            break;
    }
    if (objectHasPropertyCheck(returnArray, 'gps') && arrayNotEmptyCheck(returnArray.gps)) {
        masterDateResponse = await containerAccessor.getMasterDumpDateAccessor();
        masterDate = arrayNotEmptyCheck(masterDateResponse) ? masterDateResponse[0]['masterDate'] : null;
        await asyncForEach(returnArray.gps, async (data) => {
            dataSplitterResponse = await dataSplitterDump(data, masterDate);
            returnString = returnString || objectHasPropertyCheck(dataSplitterResponse, 'returnString') ? dataSplitterResponse['returnString'] : null;
            if (notNullCheck(dataSplitterResponse['dumpData'])) {
                dumpDataList.push(dataSplitterResponse['dumpData']);
            }
        });
        if (arrayNotEmptyCheck(dumpDataList)) {
            response = containerAccessor.insertElocksDumpDataAccessor(dumpDataList);
            let res = containerAccessor.updateMasterDumpDateAccessor('dumpDate', dumpDataList.pop()['deviceDate']);
        }
    }
    console.log('+++++++++++++++++++++return string++++++++++++++++++++++++');
    console.log(returnString);
    return returnString;
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
};

const degreeConverter = (minuteData, direction) => {
    let degree, minute, total, loc, locCode;
    if (minuteData.length === 8) {
        degree = parseInt(minuteData.slice(0, 2));
        minute = (parseFloat('' + minuteData.slice(2, 4) + '.' + minuteData.slice(4, 8))) / 60;
        total = degree + minute;
        if (direction.toString() === '1111' || direction.toString() === '1110') {
            loc = total;
            locCode = 'W';
        } else {
            loc = direction[1] === 1 ? -1 * total : total;
            locCode = direction[1] === 1 ? 'E' : 'W';
        }
    } else {
        degree = parseInt(minuteData.slice(0, 3));
        minute = (parseFloat('' + minuteData.slice(3, 5) + '.' + minuteData.slice(5, 9))) / 60;
        total = degree + minute;
        if (direction.toString() === '1111' || direction.toString() === '1110') {
            loc = total;
            locCode = 'N';
        } else {
            loc = direction[2] === 1 ? total : -1 * total;
            locCode = direction[2] === 1 ? 'N' : 'S';
        }
    }
    return {loc, locCode};
};

const dataIterator = (data, obj) => {
    data = typeof data === 'string' ? data.split('') : data;
    if (!obj) {
        obj = {
            gps: [],
            alarm: [],
            others: []
        }
    }
    if (data.length > 0) {
        switch (parseInt(data.slice(0, 2).join(''))) {
            case 24:
                obj.gps.push(data.splice(0, 98).join(''));
                break;
            case 28:
                obj.alarm.push(data.splice(0, 32).join(''));
                break;
            default:
        }
        if (data.length > 0) {
            return dataIterator(data, obj);
        } else {
            return obj;
        }
    }
    return obj;
};

const hexToBinary = (deviceStatus) => {
    let ret = '', returnValue = {flag: false, returnArray: ''},
        lookupTable = {
            '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
            '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
            'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
            'e': '1110', 'f': '1111',
            'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
            'E': '1110', 'F': '1111'
        };
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    for (let i = 0; i < deviceStatus.length; i += 1) {
        if (lookupTable.hasOwnProperty(deviceStatus[i])) {
            ret += lookupTable[deviceStatus[i]];
        }
    }
    returnValue.flag = ret.length === 16;
    returnValue.returnArray = ret;
    return returnValue;
};

module.exports = {
    locationUpdateBusiness,
    eLocksDataUpdateBusiness,
    getBeneficiaryMapHistoryBusiness
};