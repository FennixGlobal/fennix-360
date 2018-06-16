const {deviceAggregator} = require('../models/device-model');
const userIdDeviceAggregatorQuery = (query) => {
    return deviceAggregator.aggregate().match({"beneficiaryId": {$in: query}})
        .group({
            _id: "$isActive",
            count: {$sum: 1}
        });
};
const getDeviceDetailsForListOfBeneficiariesQuery = (query) => {

    return deviceAggregator.aggregate()
        .match({
            "beneficiaryId":{$in:query}
        })
        .lookup({
            from:"deviceTypes",
            localField:"deviceTypeId",
            foreignField:"_id",
            as:"deviceType"
        }).project({
            "_id":1,
            "imei":1,
            "beneficiaryId":1,
            "deviceType.name":1
        });
};
//db.getCollection('devices').find({})

// /db.getCollection('devices').find({})
const deviceDetailsByBeneficiaryId = (query) => {
    return deviceAggregator.aggregate([
        {
            $match: {
                "beneficiaryId": {"$in": query}
            }
        },
        {
            $lookup: {
                from: "deviceAttributes",
                localField: "beneficiaryId",
                foreignField: "beneficiaryId",
                as: "deviceAttributes"
            }
        },
        {
            $unwind: "$deviceAttributes"
        },
        {
            $unwind: "$deviceAttributes.locationDetails"
        },
        {
            $sort: {
                "deviceAttributes.locationDetails.deviceUpdatedDate": -1
            }
        },
        {
            $group: {
                _id: "$_id",
                latestBeneficiaryDeviceDetails: {"$first": "$$CURRENT"}
            }
        }
    ])

};

module.exports = {
    userIdDeviceAggregatorQuery,
    deviceDetailsByBeneficiaryId,
    getDeviceDetailsForListOfBeneficiariesQuery
};