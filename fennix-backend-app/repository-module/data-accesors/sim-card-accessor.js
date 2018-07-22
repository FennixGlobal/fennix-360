const {listUnAssignedSimcardsQuery, listSimcardTypesQuery} = require('../queries/simcard-query');

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
module.exports =  {
    listUnAssignedSimcardsAccessor,
    listSimcardTypesAccessor
};