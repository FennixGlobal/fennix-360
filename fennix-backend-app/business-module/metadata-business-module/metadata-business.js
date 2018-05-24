const {getCardMetadata, getHeaderMetadata, getSideNavMetadata} = require('../../repository-module/data-accesors/metadata-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var getBaseMetadata = async (req) => {
    let responseObj, headerResponse, sideNavResponse, composedData = {}, request;
    request = [req.body.roleId, req.body.lang, req.body.userId];
    headerResponse = await getHeaderMetadata(request);
    sideNavResponse = await getSideNavMetadata(request);
    if (objectHasPropertyCheck(headerResponse, 'rows') && objectHasPropertyCheck(sideNavResponse, 'rows')) {
        let headerObj = routeDataModifier(headerResponse);
        let sideNavObj = routeDataModifier(sideNavResponse);
        composedData['header'] = Object.keys(headerObj).map(dataItem => headerObj[dataItem]);
        composedData['sideNav'] = Object.keys(sideNavObj).map(dataItem => sideNavObj[dataItem]).sort((item, prevItem) => (item.sideNavOrder - prevItem.sideNavOrder));
        responseObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', composedData);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_NO_CARDS_FOR_USER_ID, 'en', composedData);
    }
    return responseObj;
};

var getCardMetadataForRoute = async (req) => {
    let responseObj, cardResponse, request;
    request = [req.body.roleId, req.body.routeId, req.body.lang, req.body.userId];
    cardResponse = await getCardMetadata(request);
    if (objectHasPropertyCheck(cardResponse, 'rows') && arrayNotEmptyCheck(cardResponse.rows)) {
        let returnObj;
        returnObj = cardResponse.rows.reduce(function (init, item) {
            var user = {
                userId: item.user_id
            };
            var widgetObj = {
                widgetId: 'W_' + item.role_cards_widgets_id,
                widgetOrderId: item.widget_order_id,
                widgetSize: item.widget_size,
                widgetType: item.widget_type,
                widgetSubType: item.widget_subtype,
                endpoint: item.endpoint,
                requestParams: item.mandatory_request_params,
                sort: item.initial_sort,
                requestType: item.request_type
            };
            var cardObj = {
                cardId: 'C_' + item.role_card_id,
                cardSize: item.card_size,
                cardHeader: item.card_header,
                cardOrderId: item.card_order_id
            };
            if (init.hasOwnProperty('userId') && init.userId !== null && init['cards'] !== null) {
                if (init['cards'].hasOwnProperty(cardObj.cardId)) {
                    init['cards'][cardObj.cardId]['widgets'].push(widgetObj);
                } else {
                    cardObj['widgets'] = [widgetObj];
                    init['cards'][cardObj.cardId] = cardObj;
                }
            } else {
                init = user;
                cardObj['widgets'] = [];
                init['cards'] = {};
                cardObj['widgets'].push(widgetObj);
                init['cards'][cardObj.cardId] = cardObj;
            }
            return init;
        }, {});
        returnObj.cards = Object.keys(returnObj.cards).map((key) => returnObj.cards[key]).sort((item, prevItem) => (item.cardOrderId - prevItem.cardOrderId));
        responseObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', returnObj.cards);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_NO_CARDS_FOR_USER_ID, 'en', []);
    }
    return responseObj;
};

var routeDataModifier = (arrayResponse) => {
    let modifiedRouteObj = {};
    if (arrayNotEmptyCheck(arrayResponse.rows)) {
        arrayResponse.rows.forEach((item) => {
            const parentRouteId = item['parent_route_id'];
            if (objectHasPropertyCheck(item, 'child_route_id') && objectHasPropertyCheck(modifiedRouteObj, parentRouteId)) {
                const childItem = childRouteCreator(item);
                modifiedRouteObj[parentRouteId]['childItems'] = modifiedRouteObj[parentRouteId]['childItems'] || [];
                modifiedRouteObj[parentRouteId]['childItems'].push(childItem);
            } else {
                const parentItem = {
                    itemId: item['parent_route_id'],
                    routeId: item['parent_route_id'],
                    action: item['parent_action'],
                    icon: item['parent_icon'],
                    position: item['parent_position'],
                    routeApi: item['parent_route_api'],
                    routeName: item['parent_route_name'],
                    routeUrl: item['parent_route_url'],
                    sideNavOrder: item['sidenav_order_id']
                };
                if (objectHasPropertyCheck(item, 'child_route_id')) {
                    parentItem['childItems'] = [childRouteCreator(item)];
                }
                modifiedRouteObj[parentRouteId] = parentItem;
            }
        });
    }
    return modifiedRouteObj;
};
var childRouteCreator = (item) => {
    const childItem = {
        itemId: item['child_route_id'],
        routeId: item['child_route_id'],
        action: item['child_action'],
        icon: item['child_icon'],
        position: item['child_position'],
        routeApi: item['child_route_api'],
        routeName: item['child_route_name'],
        routeUrl: item['child_route_url']
    };
    return childItem;
};

module.exports = {
    getBaseMetadata,
    getCardMetadataForRoute
};