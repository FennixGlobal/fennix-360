const DEVICE_BATTERY_MAP = {
    batteryPercentage: {
        alert: {value: 10, color: 'RED'},
        vioaltion: {value: 15, color: 'DARK_ORANGE'},
        warning: {value: 20, color: 'YELLOW'},
        safe: {value: 30,color: 'GREEN'},
    },
    batteryVoltage: {
        alert: {value: 2, color: 'RED'},
        vioaltion: {value: 2.5, color: 'DARK_ORANGE'},
        warning: {value: 3.4, color: 'YELLOW'},
        safe: {value: 4, color: 'GREEN'}
    }
};


module.exports = {
    DEVICE_BATTERY_MAP
};