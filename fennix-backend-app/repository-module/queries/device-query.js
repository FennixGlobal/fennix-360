const {deviceAggregator, LocationDeviceAttributeMasterModel, deviceTypeModel, DeviceCounter, DeviceAttributeModel, DeviceAttributesModelCounter} = require('../models/device-model');

const userIdDeviceAggregatorQuery = (query) => {
    return deviceAggregator.aggregate().match({"beneficiaryId": {$in: query}})
        .group({
            _id: "$active",
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
    return LocationDeviceAttributeMasterModel.aggregate([
        {
            $match: {"beneficiaryId": {$in: query}}
        },
        {
            $lookup: {
                from: "deviceAttributes",
                localField: "deviceAttributeId",
                foreignField: "_id",
                as: "deviceAttributes"
            }
        },
        {$unwind: "$deviceAttributes"},
        {
            $lookup: {
                from: "location",
                localField: "locationId",
                foreignField: "_id",
                as: "location"
            }
        },
        {$unwind: "$location"},
        {
            $lookup: {
                from: "devices",
                localField: "deviceId",
                foreignField: "_id",
                as: "device"
            }
         },
        {$unwind: "$device"}
    ]);
};

const updateLocationDeviceAttributeMasterQuery = (req) => {
    return LocationDeviceAttributeMasterModel.update({beneficiaryId: req.beneficiaryId}, {
        $set: {
            locationId: req.locationId,
            deviceAttributeId: req.deviceAttributeId,
            deviceId: req.deviceId
        }
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
        // else {
        //     console.log('success');
        // }
    });
};


const getBeneficiaryIdByImeiQuery = (query) => {
    return deviceAggregator.find({imei: query, active: true}, {"_id": 1, "beneficiaryId": 1});
};

const listDevicesQuery = (query) => {
    return deviceAggregator.aggregate([
        {
            $match: {
                "centerId": {$in: query}
            }
        },
        {
            $lookup: {
                from: "deviceTypes",
                localField: "deviceTypeId",
                foreignField: "_id",
                as: "deviceTypes"
            }
        },
        {
            $lookup: {
                from: "simcards",
                localField: "simCardId",
                foreignField: "_id",
                as: "simcards"
            }
        },
        {
            $unwind: "$deviceTypes"
        },
        {
            $unwind: "$simcards"
        },
        {
            $project: {
                "imei": 1,
                "deviceTypes.name": 1,
                "simcards.phoneNo": 1,
                "active": 1,
                "centerId": 1,
                "beneficiaryId": 1
            }
        }
    ])
};

const listDeviceTypesQuery = () => {
    return deviceTypeModel.find(
        {
            "active": true
        },
        {
            "name": 1
        }
    );
};

const updateDeviceAttributeQuery = (req) => {
    let deviceAttribute = new DeviceAttributeModel(req);
    deviceAttribute.save(function (err) {
        if (err) return console.error(err);
    });
};

const getDeviceAttributeCounterQuery = () => {
    return DeviceAttributesModelCounter.findAndModify({update:{$inc:{counter:1}}});
};

// const updateDeviceCounterQuery = (req) => {
//     DeviceAttributesModelCounter.update({_id: req}, {$inc: {counter: 1}}).then(doc => {
//         if (!doc) {
//             console.log('error');
//         }
//         // else {
//         //     console.log('success');
//         // }
//     });
// };

const insertDeviceQuery = (req) => {
    let deviceObj = new deviceAggregator(req);
    deviceObj.save(function (err) {
        if (err) return console.error(err);
    });
};

// const fetchNextPrimaryKeyQuery = () => {
//     return DeviceCounter.find();
// };
//
// //TODO: add retry logic for failure conditions
// const insertNextPrimaryKeyQuery = (req) => {
//     DeviceCounter.update({_id: req}, {$inc: {counter: 1}}).then(doc => {
//         if (!doc) {
//             console.log('error');
//         }
//         // else {
//         //     console.log('success');
//         // }
//     });
// };

const getDeviceDetailsByDeviceIdQuery = (req) => {
    return deviceAggregator.aggregate([
        {
            $match: {
                _id: req.deviceId
            }
        },
        {
            $lookup: {
                from: 'simcards',
                localField: 'simCardId',
                foreignField: '_id',
                as: 'simcards'
            }
        },
        {
            $lookup: {
                from: 'deviceTypes',
                localField: 'deviceTypeId',
                foreignField: '_id',
                as: 'deviceType'
            }
        },
        {$unwind: '$simcards'},
        {$unwind: '$deviceType'},
        {
            $project: {
                'imei': 1,
                'active': 1,
                'simcards.phoneNo': 1,
                'simcards.simCardType': 1,
                'firmwareVersion': 1,
                'deviceType.name': 1
            }
        }
    ])
};
const fetchNextPrimaryKeyQuery = () => {
    return DeviceCounter.findAndModify({update:{$inc:{counter:1}}});
};
const getDeviceDetailsByBeneficiaryIdQuery = (req) => {
    return LocationDeviceAttributeMasterModel.aggregate([
        {
            $match: {"beneficiaryId":  req.beneficiaryId}
        },
        {
            $lookup: {
                from: "deviceAttributes",
                localField: "deviceAttributeId",
                foreignField: "_id",
                as: "deviceAttributes"
            }
        },
        {$unwind: "$deviceAttributes"},
        {
            $lookup: {
                from: "devices",
                localField: "deviceId",
                foreignField: "_id",
                as: "device"
            }
        },
        {$unwind: "$device"}
    ]);
};
module.exports = {
    userIdDeviceAggregatorQuery,
    deviceDetailsByBeneficiaryId,
    getDeviceDetailsForListOfBeneficiariesQuery,
    listDevicesQuery,
    listDeviceTypesQuery,
    insertDeviceQuery,
    // insertNextPrimaryKeyQuery,
    fetchNextPrimaryKeyQuery,
    getDeviceAttributeCounterQuery,
    updateDeviceAttributeQuery,
    // updateDeviceCounterQuery,
    getBeneficiaryIdByImeiQuery,
    getDeviceDetailsByBeneficiaryIdQuery,
    getDeviceDetailsByDeviceIdQuery,
    updateLocationDeviceAttributeMasterQuery
};