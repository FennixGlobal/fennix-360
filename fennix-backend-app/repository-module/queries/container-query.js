const {ElocksDeviceAttributeModel} = require('../models/container-model');

const addContainerDetailsQuery = 'insert into ';

const listContainersQuery = 'select * from container where isactive = true';

const getTotalNoOfContainersQuery = 'select count(*) from container where isactive = true';

const listUnassignedContainersQuery = 'select container_id, container_name from container where (device_id is null or device_id = 0) and isactive = true';


const updateElockAttributeQuery = (req) => {
    let deviceAttribute = new ElocksDeviceAttributeModel(req);
    deviceAttribute.save(function (err) {
        if (err) return console.error(err);
    });
};

const getContainerForDeviceIdQuery = 'select container_id from container where device_id = $1';

module.exports = {
    addContainerDetailsQuery,
    getContainerForDeviceIdQuery,
    listContainersQuery,
    updateElockAttributeQuery,
    getTotalNoOfContainersQuery,
    listUnassignedContainersQuery
};