const routeQueries = require('../queries/route-query');

const insertRouteAccessor = async (req) => {
    let response;
    response = await routeQueries.insertCompanyRoutesQuery(req);
    return response;
};

module.exports = {
    insertRouteAccessor
};
