const {deviceAggregator,deviceTypeModel} = require('../models/device-model');
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
            "beneficiaryId": {$in: query}
        })
        .lookup({
            from: "deviceTypes",
            localField: "deviceTypeId",
            foreignField: "_id",
            as: "deviceType"
        }).project({
            "_id": 1,
            "imei": 1,
            "beneficiaryId": 1,
            "deviceType.name": 1
        });
};

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
        },
        {
            $lookup: {
                from: "deviceTypes",
                localField: "latestBeneficiaryDeviceDetails.deviceTypeId",
                foreignField: "_id",
                as: "deviceType"
            }
        }
    ]);
};

const listDevicesQuery = (query) => {
    return deviceAggregator.aggregate([
        {
            $match: {
                "centerId": {$in:query}
            }
        },
        {
            $lookup:{
                from: "deviceTypes",
                localField:"deviceTypeId",
                foreignField: "_id",
                as:"deviceTypes"
            }
        },
        {
            $lookup:{
                from: "simcards",
                localField:"simCardId",
                foreignField:"_id",
                as:"simcards"
            }
        },
        {
            $unwind:"$deviceTypes"
        },
        {
            $unwind:"$simcards"
        },
        {
            $project: {
                "imei":1,
                "deviceTypes.name":1,
                "simcards.phoneNo":1,
                "isActive":1,
                "centerId": 1,
                "beneficiaryId": 1
            }
        }
    ])
};

const listDeviceTypesQuery = () => {
    return deviceTypeModel.find(
        {
            "isActive":true
        },
        {
            "name":1
        }
    );
};

module.exports = {
    userIdDeviceAggregatorQuery,
    deviceDetailsByBeneficiaryId,
    getDeviceDetailsForListOfBeneficiariesQuery,
    listDevicesQuery,
    listDeviceTypesQuery
};