const routeQueries = require('../queries/route-query');

const insertRouteAccessor = async (req) => {
    let response;
    response = await routeQueries.insertCompanyRoutesQuery(req);
    return response;
};

const fetchAndUpdateCompanyRoutePrimaryKeyAccessor = async () => {
    let response;
    response = await routeQueries.fetchAndUpdateCompanyRoutePrimaryKeyQuery();
    console.log(response);
    return response;
};

const editCompanyRoutesAccessor = async (routeId, req) => {
    let response;
    response = await routeQueries.editCompanyRoutesQuery(routeId, req);
    return response;
};
const insertCompanyPrimaryAddressAccessor = async (routeId, req) => {
    let response;
    response = await routeQueries.insertCompanyPrimaryAddressQuery(req);
    return response;
};
module.exports = {
    insertRouteAccessor,
    insertCompanyPrimaryAddressAccessor,
    editCompanyRoutesAccessor,
    fetchAndUpdateCompanyRoutePrimaryKeyAccessor
};
