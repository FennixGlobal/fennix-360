const addContainerDetailsQuery = 'insert into ';

const listContainersQuery = 'select * from container where isactive = true';

const getTotalNoOfContainersQuery = 'select count(*) from container where isactive = true';

const listUnassignedContainersQuery = 'select container_id, container_name from container where (device_id is null or device_id = 0) and isactive = true';

module.exports = {
    addContainerDetailsQuery,
    listContainersQuery,
    getTotalNoOfContainersQuery,
    listUnassignedContainersQuery
};