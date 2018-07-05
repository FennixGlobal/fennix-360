const {listSimcardsQuery} = require('../queries/simcard-query');

const listSimcardsAccessor = async (req) => {
    let returnObj;
    returnObj = await listSimcardsQuery(req);
    return returnObj;
};

module.exports =  {
    listSimcardsAccessor
};