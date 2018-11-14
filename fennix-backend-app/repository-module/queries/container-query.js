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

            // deviceDate: {
            //     $gte: req.fromDate,
            //     $lte: req.toDate
            // },
const getContainerMapHistoryQuery = (req) => {
    console.log(req);
    return ElocksLocationModel.aggregate([{
        $match: {
            containerId: req.containerId,
            _id:{
                $gte:50000
            }
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