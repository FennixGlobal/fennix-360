const locationAccessor = require('../../repository-module/data-accesors/location-accesor');
const {deviceBusiness} = require('../location-business-module/location-business');
//Connection Commands
//(Tracker -> Server)
const cmdLogin = "#SA";
//(Server- > Tracker)
const cmdLoginResponse = "#SB";
//(Tracker -> Server)
const cmdLogout = "#SC";
//(Tracker -> Server)
const cmdCheckConnection = "#SE";
//(Tracker -> Server)
const cmdOperatorAndAPN = "#SI";

//Positioning Commands
//(Server- > Tracker)
const cmdIntervalTimeSetting = "#RC";
//(Tracker -> Server)
const cmdLocationReport = "#RD";
const cmdLocationResponse = "#RE";

//Other Commands
//(Server- > Tracker)
const cmdSMSPasswordAndSOSPhone = "#OC";
//(Tracker -> Server)
const cmdSMSPasswordAndSOSPhoneResponse = "#OD";
//(Server- > Tracker)
const cmdChangeIPaddressAndPort = "#OY";
//(Tracker -> Server)
const cmdChangeIPaddressAndPortResponse = "#OZ";
//(Server- > Tracker)
const cmdDeviceSettingParameter = "#XA";
//(Tracker -> Server)
const cmdDeviceSettingParameterResponse = "#XB";
//0N000000000000000000
const deviceParameters = "00000" + "000000000000000";
//102338210001000000000
const deviceAlarms = "000000000000000000000";
let id, loginStatus;
let locationObj = {}, deviceObj = {};
const locationUpdateBusiness = (data) => {
    console.log('entering method');
    console.log(data);
    let returnString = '';
    if (data.indexOf(cmdLogin) !== -1) {
        console.log('entered login part');
        returnString = processData(data);
    } else if (data.indexOf(cmdLocationReport) !== -1) {
        console.log('entered location report');
        console.log(data);
        // let values = data.split('#')[1].split('');
        // values.forEach((item) => {
        //     console.log('this is the location data');
        //     console.log(item);
        processLocation(data);
        // });
    }
    return returnString;
};

const processData = (data) => {
    let returnString = '';
    const checkSum = 3;
    const dataCommand = data. substr(0, 3);
    locationObj = {
        connectionSession: data. substr(3, 6),
        serialNumber: data. substr(9, 5),
    };
    const loginHome = dataCommand.length + locationObj.connectionSession.length + locationObj.serialNumber.length + data. substr(14, 15).length;
    deviceObj = {
        imei: data. substr(14, 15),
        firmwareVersion: data. substr(loginHome, (data.length - 1) - (loginHome - 1) - checkSum)
    };
    this.id = deviceObj.imei;
    if (!this.loginStatus) {
        this.loginStatus = processLogin();
    }
    returnString = data.replace(data. substr(0, 2), '#SB');
    return returnString;
};

const processLocation = (location) => {
    let locationObj = {}, latitude, longitude;
    const NudosToKm = 1.852;
    const direction = 6;
    let command = location. substr(0, 3);
    let connectionSession = location. substr(3, 6);
    let day = location. substr(29, 2);
    let month = location. substr(31, 2);
    let year = location. substr(33, 2);
    let hours = location. substr(35, 2);
    let minutes = location. substr(37, 2);
    let seconds = location. substr(39, 2);
    let dateTime = `${day} ${month} ${year} ${hours}:${minutes}`;
    let devices = {
        imei: location. substr(14, 15),
        deviceUpdatedDate: dateTime
    };
    const vel = location. substr(62, 5);
    let deviceAttribute = {
        beneficiaryId: 78,
        serialNumber: location. substr(9, 5),
        hdop: location. substr(99, 2),
        cellId: location. substr(108, 4),
        mcc: location. substr(101, 3),
        lac: location. substr(104, 4),
        serverDate: new Date(),
        speed: ((parseInt(vel. substr(0, 3), 10) + parseFloat(vel. substr(4, 1)) / 10) * NudosToKm),
        course: parseInt(location. substr(67, 2)) * direction,
        moveDistance: parseInt(location. substr(69, 5)),
        gpsStatus: location. substr(74, 1),
        alarmStatus: location. substr(75, 21),
        // location.BatteryPercentage = GetBatteryPercent(location.BatteryVoltage);
        satellitesNumber: location. substr(96, 2),
        deviceUpdatedDate: dateTime,
        GPSFixedStatus: location. substr(98, 1)
    };

    let lat = location. substr(41, 10);
    console.log(lat);
    let signLat = !lat.indexOf("N") !== -1 ? 1 : -1;
    latitude = signLat * getValue(lat. substr(0, 2), lat. substr(2, 2), lat. substr(5, 4));
    let lng = location. substr(51, 11);
    let signLng = !lng.indexOf("E") !== -1 ? 1 : -1;
    longitude = signLng * getValue(lng. substr(0, 3), lng. substr(3, 2), lng. substr(6, 4));
    console.log('longitude');
    console.log(longitude);
    console.log('latitude');
    console.log(latitude);
    locationObj = {
        longitude: longitude,
        latitude: latitude,
        beneficiaryId: 78,
        deviceDate: dateTime
    };
    locationAccessor.updateLocation(locationObj).then((doc) => {
        console.log(doc)
    });
    // deviceBusiness.updateDeviceDetails({device: devices, deviceAttr: deviceAttribute});

};

processLogin = () => {
    let returnFlag = false;
};

const getValue = (intPart, decimalPart1, decimalPart2) => {
    let ret = 0;
    ret = parseFloat(intPart);
    ret += parseFloat(decimalPart1) / 60;
    ret += parseFloat(decimalPart2) / (60 * 10000);
    return ret;
};

module.exports = {
    locationUpdateBusiness
};