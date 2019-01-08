const {ElocksTripCounterModel, ElocksTripDataModel} = require('../models/trip-model');

const getActiveTripDetailsByContainerIdQuery = (req) => {
    return ElocksTripDataModel.aggregate([
        {
            $match: {
                containerId: req.containerId
            }
        },
        {
            $sort: {
                createdDate: -1
            }
        },
        {
            $limit: req.tripLimit
        }
    ]);
};

const insertElockTripDataQuery = (req) => {
    return ElocksTripDataModel.collection.insert(req, function (err, doc) {
        if (err) {
            return console.error(err);
        } else {
            return "Inserted elock trip data successfully";
        }
    });
};
const fetchTripDetailsQuery = (req) => {
    return ElocksTripDataModel.find({
        tripStatus: {$in: req.status},
        containerId: req.containerId
    });
};
const updateTripStatusQuery = (req) => {
    return ElocksTripDataModel.update({tripId: req.tripId}, {
        $set: req.setFields
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};
const fetchNextElockTripPrimaryKeyQuery = () => {
    return ElocksTripCounterModel.findOneAndUpdate({}, {$inc: {counter: 1}});
};

const getNotificationEmailsForTripIdQuery = (req) => {
    return ElocksTripDataModel.find({tripId: req.tripId})
};

module.exports = {
    fetchTripDetailsQuery,
    getNotificationEmailsForTripIdQuery,
    fetchNextElockTripPrimaryKeyQuery,
    insertElockTripDataQuery,
    updateTripStatusQuery,
    getActiveTripDetailsByContainerIdQuery
};