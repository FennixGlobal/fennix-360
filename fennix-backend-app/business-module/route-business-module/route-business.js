const routeAccessors = require('../../repository-module/data-accesors/route-accessor');

const insertCompanyRouteBusiness = async (req) => {
    let request = req.body, routeRequest = {}, response;
    routeRequest.companyId = request.companyId;
    routeRequest.companyAddress = request.companyAddress;
    routeRequest.primaryWarehouseAddress = request.primaryWarehouseAddress;
    routeRequest.primaryPortAddress = request.primaryPortAddress;
    routeRequest.startAddress = request.startAddress;
    routeRequest.endAddress = request.endAddress;
    response = await routeAccessors.insertRouteAccessor(routeRequest);
    return response;
};

module.exports = {
  insertCompanyRouteBusiness
};