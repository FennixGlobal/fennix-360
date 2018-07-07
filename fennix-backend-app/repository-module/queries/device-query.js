const {deviceAggregator,deviceTypeModel,DeviceCounter} = require('../models/device-model');

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

const insertDeviceQuery = (req) => {
    let deviceObj = new deviceAggregator(req);
    deviceObj.save(function (err) {
        if (err) return console.error(err);
    });
};

const fetchNextPrimaryKeyQuery = () => {
    return DeviceCounter.find();
};

//TODO: add retry logic for failure conditions
const insertNextPrimaryKeyQuery = (req) => {
    DeviceCounter.update({_id: req}, {$inc: {counter:1}}).then(doc => {
        if (!doc) {
            console.log('error');
        } else {
            console.log('success');
        }
    });
};

const getDeviceDetailsByDeviceIdQuery = (req) => {
    return deviceAggregator.aggregate([
        {
            $match:{
                _id:req.deviceId
            }
        },
        {
            $lookup:{
                from:'simcards',
                localField:'simCardId',
                foreignField:'_id',
                as:'simcards'
            }
        },
        {
            $lookup:{
                from:'deviceTypes',
                localField:'deviceTypeId',
                foreignField:'_id',
                as:'deviceType'
            }
        },
        {$unwind:'$simcards'},
        {$unwind:'$deviceType'},
        {$project:{
                'imei':1,
                'isActive':1,
                'simcards.phoneNo':1,
                'simcards.simCardType':1,
                'firmwareVersion':1,
                'deviceType.name':1
            }
        }
    ])
};

module.exports = {
    userIdDeviceAggregatorQuery,
    deviceDetailsByBeneficiaryId,
    getDeviceDetailsForListOfBeneficiariesQuery,
    listDevicesQuery,
    listDeviceTypesQuery,
    insertDeviceQuery,
    insertNextPrimaryKeyQuery,
    fetchNextPrimaryKeyQuery,
    getDeviceDetailsByDeviceIdQuery
};