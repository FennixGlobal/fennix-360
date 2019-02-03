const searchQueries = require('../queries/search-query');

const searchAccessor = async (req) => {
    let returnObj;
    returnObj = await searchQueries.searchQuery(req);
    return returnObj;
};

module.exports = {
    searchAccessor
};