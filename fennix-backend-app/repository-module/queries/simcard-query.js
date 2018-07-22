const {simcardDetails,simCardTypeModel} = require('../models/simcard-model');

const listUnAssignedSimcardsQuery = (query) => {
    return simcardDetails.aggregate(
        [
            {
                $match :{
                    $and : [
                        {
                            $or : [
                                {
                                    "deviceId": { $eq:null }
                                },
                                {
                                    "deviceId": { $eq:"" }
                                }
                            ]
                        },
                        {
                            "isActive":true
                        },
                        {
                            "centerId":query.centerId
                        }
                    ]}},
            {
                $lookup: {
                    from: "carrierByCountry",
                    localField: "carrierByCountryId",
                    foreignField: "_id",
                    as: "cCountry"
                }
            },
            {
                $unwind:"$cCountry"
            },
            {
                $lookup: {
                    from: "carrier",
                    localField: "cCountry.carrierId",
                    foreignField: "_id",
                    as : "carrier"

                }
            },
            {
                $unwind:"$carrier"
            },
            {
                $project: {
                    "carrier.name" : 1,
                    "phoneNo":1,
                    "serialNp":1,
                    "isActive":1
                }
            }
        ]
    );
};

const insertSimcardQuery = (query) => {
    return simcardDetails.insert(query);
};

const updateSimcardQuery = (query) => {
    return simcardDetails.update(query.where, query.update, query.upsert, query.multi);
};

const deleteSimcardQuery = (query) => {
    return simcardDetails.find(query.where).remove().exec();
};

const getSimcardDetailsQuery = (query) => {
    return simcardDetails.aggregate([
        {
            $match: {
                "centerId": {$in: query}
            }
        },
        {
            $lookup: {
                from: "carrierByCountry",
                localField: "carrierByCountryId",
                foreignField: "_id",
                as: "carrierByCountryDetails"
            }
        },
        {
            $unwind: "$carrierByCountryDetails"
        },
        {
            $lookup: {
                from: "carrier",
                localField: "carrierByCountryDetails.carrierId",
                foreignField: "_id",
                as: "carrier"
            }
        },
        {
            $unwind: "$carrier"
        },
        {
            $project: {
                "simCardType": 1,
                "phoneNo": 1,
                "deviceId": 1,
                "serialNp": 1,
                "carrier.name": 1,
                "carrierByCountryDetails.apn": 1,
                "centerId": 1
            }
        }
    ]);
};

const listSimcardTypesQuery = () => {
    return simCardTypeModel.find();
};

module.exports = {
    listSimcardTypesQuery,
    getSimcardDetailsQuery,
    insertSimcardQuery,
    updateSimcardQuery,
    deleteSimcardQuery,
    listUnAssignedSimcardsQuery
};