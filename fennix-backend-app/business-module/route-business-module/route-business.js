const routeAccessors = require('../../repository-module/data-accesors/route-accessor');
const {objectHasPropertyCheck, arrayNotEmptyCheck, responseObjectCreator} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const insertCompanyRouteBusiness = async (req) => {
    let request = req, routeRequest = {}, response, counterResponse, primaryAddressRequest = {}, companyId = 0,
        routeArray = [];
    counterResponse = await routeAccessors.fetchAndUpdateCompanyRoutePrimaryKeyAccessor();
    console.log(counterResponse);
    routeRequest.routeId = counterResponse['counter'];
    companyId = parseInt(request['companyId'], 10);
    primaryAddressRequest = responseObjectCreator(request, ['companyId', 'companyAddress', 'primaryWarehouseAddress', 'primaryPortAddress'], ['companyId', 'companyAddress', 'primaryWarehouseAddress', 'primaryPortAddress']);
    ['companyId', 'companyAddress', 'primaryWarehouseAddress', 'primaryPortAddress'].forEach((reqItem) => {
        delete routeRequest[reqItem];
    });
    await routeAccessors.insertCompanyPrimaryAddressAccessor(primaryAddressRequest);
    if (objectHasPropertyCheck(request, 'routes') && arrayNotEmptyCheck(request.routes)) {

        request.routes.forEach((route) => {
            const newRoute = responseObjectCreator(route, ['startAddress', 'endAddress', 'waypoints', 'stoppagePoints', 'totalDistance'], ['startAddress', 'endAddress', 'waypoints', 'stoppagePoints', 'totalDistance']);
            newRoute['companyId'] = companyId;
            routeArray.push(newRoute);
        });
        await routeAccessors.insertRouteAccessor(routeArray);
    }
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
const getRouteByCompanyIdBusiness = async (req) => {
    const companyId = req.query.companyId;
    let routeResponse;
    routeResponse = await routeAccessors.getRouteByCompanyIdAccessor(companyId);
    return fennixResponse(200, 'EN_US', routeResponse);
};
module.exports = {
    editCompanyRoutesBusiness,
    insertCompanyRouteBusiness,
    getRouteByCompanyIdBusiness,
    deleteCompanyRoutesBusiness
};
