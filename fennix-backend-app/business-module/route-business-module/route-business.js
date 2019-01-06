const routeAccessors = require('../../repository-module/data-accesors/route-accessor');

const insertCompanyRouteBusiness = async (req) => {
    let request = req.body, routeRequest = {}, response, counterResponse;
    counterResponse = await routeAccessors.fetchAndUpdateCompanyRoutePrimaryKeyAccessor();
    routeRequest.routeId = counterResponse['_doc']['counter'];
    routeRequest.companyId = request.companyId;
    routeRequest.companyAddress = request.companyAddress;
    routeRequest.primaryWarehouseAddress = request.primaryWarehouseAddress;
    routeRequest.primaryPortAddress = request.primaryPortAddress;
    routeRequest.startAddress = request.startAddress;
    routeRequest.endAddress = request.endAddress;
    response = await routeAccessors.insertRouteAccessor(routeRequest);
    return response;
};
const deleteCompanyRoutesBusiness = async (req) => {
    let request = {isActive: false};
    await routeAccessors.editCompanyRoutesAccessor(req.body.routeId, request);
};

const editCompanyRoutesBusiness = async (req) => {
    let request = req.body, routeRequest = {}, response;
    routeRequest.companyId = request.companyId;
    routeRequest.companyAddress = request.companyAddress;
    routeRequest.primaryWarehouseAddress = request.primaryWarehouseAddress;
    routeRequest.primaryPortAddress = request.primaryPortAddress;
    routeRequest.startAddress = request.startAddress;
    routeRequest.endAddress = request.endAddress;
    response = await routeAccessors.editCompanyRoutesAccessor(request.routeId, routeRequest);
    return response;
};

module.exports = {
    editCompanyRoutesBusiness,
    insertCompanyRouteBusiness,
    deleteCompanyRoutesBusiness
};