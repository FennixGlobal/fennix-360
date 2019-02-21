const DEVICE_BATTERY_MAP = {
    batteryPercentage: {
        alert: {startValue: 0, color: 'RED', endValue: 10},
        violation: {startValue: 10, color: 'DARK_ORANGE', endValue: 20},
        warning: {startValue: 20, color: 'YELLOW', endValue: 30},
        safe: {startValue: 30, color: 'GREEN', endValue: 100},
    },
    batteryVoltage: {
        alert: {value: 2, color: 'RED'},
        violation: {value: 2.5, color: 'DARK_ORANGE'},
        warning: {value: 3.4, color: 'YELLOW'},
        safe: {value: 4, color: 'GREEN'}
    }
};


module.exports = {
    DEVICE_BATTERY_MAP
};