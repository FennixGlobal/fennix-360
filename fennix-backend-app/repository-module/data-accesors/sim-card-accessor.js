const {listUnAssignedSimcardsQuery, listSimcardTypesQuery, insertSimcardQuery, fetchNextPrimaryKeyQuery, insertNextPrimaryKeyQuery} = require('../queries/simcard-query');

const listUnAssignedSimcardsAccessor = async (req) => {
    let returnObj;
    returnObj = await listUnAssignedSimcardsQuery(req);
    return returnObj;
};
const listSimcardTypesAccessor = async () => {
    let returnObj;
    returnObj = await listSimcardTypesQuery();
    return returnObj;
};

const addSimcardAccessor = async (req) => {
    let returnObj;
    returnObj = await insertSimcardQuery(req);
    return returnObj;
};

const fetchNextPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await fetchNextPrimaryKeyQuery();
    return returnObj;
};

const insertNextPrimaryKeyAccessor = async (req) => {
    await insertNextPrimaryKeyQuery(req);
};

module.exports =  {
    listUnAssignedSimcardsAccessor,
    listSimcardTypesAccessor,
    addSimcardAccessor,
    insertNextPrimaryKeyAccessor,
    fetchNextPrimaryKeyAccessor
};