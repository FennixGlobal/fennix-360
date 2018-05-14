const {deviceAggregator} = require('../models/device-model');
const userIdDeviceAggregatorQuery = (query) => {

    return deviceAggregator.aggregate([
        {
            $match : {
                "beneficiaryId":{$in:query}
            }
        },
        {
            $group : {
                _id:"$isActive",
                count:{$sum:1}
            }
        }
    ]);
};

module.exports = {
    userIdDeviceAggregatorQuery
};