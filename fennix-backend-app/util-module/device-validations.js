const {DEVICE_ATTRIBUTE_CONSTANTS} = require('./device-attribute-constants');
const deviceValidator = (deviceAttributes, beneficiaryId, location) => {
    let validationObj, validationCounter;
    Object.keys((deviceAttributes) => {
        switch (key) {
            case DEVICE_ATTRIBUTE_CONSTANTS.BATTERY_VOLTAGE: {
                validationObj[DEVICE_ATTRIBUTE_CONSTANTS.BATTERY_VOLTAGE] = batteryValidator(deviceAttributes[key]);
                break;
            }
            case DEVICE_ATTRIBUTE_CONSTANTS.GSM_ALARM: {
                validationObj[DEVICE_ATTRIBUTE_CONSTANTS.GSM_ALARM] = gsmValidator(deviceAttributes[key]);
                break;
            }
            case DEVICE_ATTRIBUTE_CONSTANTS.BELT_ALARM: {
                validationObj[DEVICE_ATTRIBUTE_CONSTANTS.BELT_ALARM] = alarmValidator(deviceAttributes[key]);
                break;
            }
            case DEVICE_ATTRIBUTE_CONSTANTS.SHELL_ALARM: {
                validationObj[DEVICE_ATTRIBUTE_CONSTANTS.SHELL_ALARM] = alarmValidator(deviceAttributes[key]);
                break;
            }
            // case DEVICE_ATTRIBUTE_CONSTANTS.HOUSE_ARREST_ALARM:{
            //     validationObj[DEVICE_ATTRIBUTE_CONSTANTS.HOUSE_ARREST_ALARM] = geofenceValidator(deviceAttributes[key],location,beneficiaryId);
            //     break;
            // }
        }
    })
};

const batteryValidator = (batteryVoltage) => {
return batteryVoltage < 10;
};
const gsmValidator = (gsmLevel) => {
    return gsmLevel <= 1;
};

const geofenceValidator = () => {

};


const alarmValidator = (alarmStatus) => {
    return alarmStatus === 1;
};

module.exports = {
    deviceValidator
};