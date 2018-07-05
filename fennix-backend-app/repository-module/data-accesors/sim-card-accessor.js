const {listSimcardsQuery,listSimcardTypesQuery} = require('../queries/simcard-query');

const listSimcardsAccessor = async (req) => {
    let returnObj;
    returnObj = await listSimcardsQuery(req);
    return returnObj;
};
const listSimcardTypesAccessor = async () => {
    let returnObj;
    returnObj = await listSimcardTypesQuery();
    return returnObj;
};
module.exports =  {
    listSimcardsAccessor,
    listSimcardTypesAccessor
};