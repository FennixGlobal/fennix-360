const {ElocksDeviceAttributeModel, LocationDeviceAttributeContainerMasterModel, ElocksLocationModel, ElocksDeviceAttributesCounterModel, ElocksLocationCounterModel} = require('../models/container-model');

const addContainerDetailsQuery = 'insert into ';

// const listContainersQuery = 'select * from container where isactive = true';
//
// const getTotalNoOfContainersQuery = 'select count(*) from container where isactive = true';

const listContainersQuery = 'select * from container where isactive = true and owner_user_id IN ';

const getTotalNoOfContainersQuery = 'select count(*) from container where isactive = true and owner_user_id IN ';

const listUnassignedContainersQuery = 'select container_id, container_name,container_type,company_name from container where (device_id is null or device_id = 0) and isactive = true';
const getTotalNoOfContainersForMapQuery = 'select count(*) from container where (device_id is null or device_id = 0) and isactive = true and owner_user_id IN ';


const updateElockAttributeQuery = (req) => {
    let deviceAttribute = new ElocksDeviceAttributeModel(req);
    deviceAttribute.save(function (err) {
        if (err) return console.error(err);
    });
};

const getContainerForDeviceIdQuery = 'select container_id from container where device_id = $1';

const insertElocksLocationQuery = (req) => {
    ElocksLocationModel.collection.insert(req, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            return "Elocks location documents inserted to Collection";
        }
    });
};

const fetchNextLocationPrimaryKeyQuery = () => {
    return ElocksLocationCounterModel.find();
};

const fetchNextDeviceAttributesPrimaryKeyQuery = () => {
    return ElocksDeviceAttributesCounterModel.find();
};

const insertElocksDeviceAttributesQuery = (req) => {
    ElocksDeviceAttributeModel.collection.insert(req, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            return "Elocks device attributes documents inserted to Collection";
        }
    });
};
const updateElocksLocationDeviceAttributeMasterQuery = (req) => {
    return LocationDeviceAttributeContainerMasterModel.update({containerId: req.containerId}, {
        $set: {
            locationId: req.locationId,
            deviceAttributeId: req.eLockAttributeId,
            deviceId: req.deviceId
        }
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};

const updateNextLocationPrimaryKeyQuery = (counter) => {
    return ElocksLocationCounterModel.update({}, {
        counter: counter
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};
const getContainerMapHistoryQuery = (req) => {
    return ElocksLocationModel.aggregate([{
        $match: {
            deviceDate: {
                $gte: new Date(`${req.fromDate}`),
                $lte: new Date(`${req.toDate}`)
            }, containerId: req.containerId
        }
    }]);
};
const updateNextDeviceAttributesPrimaryKeyQuery = (counter) => {
    return ElocksDeviceAttributesCounterModel.update({}, {
        counter: counter
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};

const getMasterDumpDateQuery = () => {
    return ElocksDumpMasterModel.find();
};

const updateMasterDumpDateQuery = (field, data) => {
    return ElocksDumpMasterModel.update({}, {
        $set: {[field]: data}
    }, {upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};

const insertElocksDumpDataQuery = (req) => {
    return ElocksDumpDataModel.collection.insert(req, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            return "Elocks dump data inserted to collection";
        }
    });
};

//TODO: need to add limit check
const getSortedDumpDataQuery = () => {
    return ElocksDumpDataModel.find().sort({"elocksDeviceDate": -1});
};

const deleteSortedDumpDataQuery = (req) => {
    return ElocksDumpDataModel.find({_id: {$in: req}}).remove().exec();
};

module.exports = {
    updateNextLocationPrimaryKeyQuery,
    updateNextDeviceAttributesPrimaryKeyQuery,
    addContainerDetailsQuery,
    getContainerForDeviceIdQuery,
    listContainersQuery,
    fetchNextLocationPrimaryKeyQuery,
    fetchNextDeviceAttributesPrimaryKeyQuery,
    updateElockAttributeQuery,
    updateElocksLocationDeviceAttributeMasterQuery,
    insertElocksLocationQuery,
    insertElocksDeviceAttributesQuery,
    getTotalNoOfContainersQuery,
    getContainerMapHistoryQuery,
    listUnassignedContainersQuery,
    getTotalNoOfContainersForMapQuery
};