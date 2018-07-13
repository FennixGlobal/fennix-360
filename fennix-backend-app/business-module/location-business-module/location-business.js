const {locationAccessor} = require('../../repository-module/data-accesors/location-accesor');
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
    if (data.substring(data.indexOf(cmdLogin) + 1)) {
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
    const dataCommand = data.substring(0, 3);
    locationObj = {
        connectionSession: data.substring(3, 6),
        serialNumber: data.substring(9, 5),
    };
    const loginHome = dataCommand.length + locationObj.connectionSession.length + locationObj.serialNumber.length + data.substring(14, 15).length;
    deviceObj = {
        imei: data.substring(14, 15),
        firmwareVersion: data.substring(loginHome, (data.length - 1) - (loginHome - 1) - checkSum)
    };
    this.id = deviceObj.imei;
    if (!this.loginStatus) {
        this.loginStatus = processLogin();
    }
    returnString = data.replace(data.substring(0, 2), '#SB');
    return returnString;
};

const processLocation = (location) => {
    let locationObj = {}, latitude, longitude;
    const NudosToKm = 1.852;
    const direction = 6;
    let command = location.substring(0, 3);
    let connectionSession = location.substring(3, 6);
    let day = location.substring(29, 2);
    let month = location.substring(31, 2);
    let year = location.substring(33, 2);
    let hours = location.substring(35, 2);
    let minutes = location.substring(37, 2);
    let seconds = location.substring(39, 2);
    let dateTime = `${day} ${month} ${year} ${hours}:${minutes}`;
    let devices = {
        imei: location.substring(14, 15),
        deviceUpdatedDate: dateTime
    };
    const vel = location.substring(62, 5);
    let deviceAttribute = {
        beneficiaryId: 78,
        serialNumber: location.substring(9, 5),
        hdop: location.substring(99, 2),
        cellId: location.substring(108, 4),
        mcc: location.substring(101, 3),
        lac: location.substring(104, 4),
        serverDate: new Date(),
        speed: ((parseInt(vel.substring(0, 3), 10) + parseFloat(vel.substring(4, 1)) / 10) * NudosToKm),
        course: parseInt(location.substring(67, 2)) * direction,
        moveDistance: parseInt(location.substring(69, 5)),
        gpsStatus: location.substring(74, 1),
        alarmStatus: location.substring(75, 21),
        // location.BatteryPercentage = GetBatteryPercent(location.BatteryVoltage);
        satellitesNumber: location.substring(96, 2),
        deviceUpdatedDate: dateTime,
        GPSFixedStatus: location.substring(98, 1)
    };

    let lat = location.substring(41, 10);
    let signLat = !lat.indexOf("N") !== -1 ? 1 : -1;
    latitude = signLat * getValue(lat.substring(0, 2), lat.substring(2, 2), lat.substring(5, 4));
    let lng = location.substring(51, 11);
    let signLng = !lng.indexOf("E") !== -1 ? 1 : -1;
    longitude = signLng * getValue(lng.substring(0, 3), lng.substring(3, 2), lng.substring(6, 4));
    locationObj = {
        longitude,
        latitude,
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