const {simcardDetails} = require('../models/simcard-model');

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

module.exports = {
    getSimcardDetailsQuery,
    insertSimcardQuery,
    updateSimcardQuery,
    deleteSimcardQuery
};