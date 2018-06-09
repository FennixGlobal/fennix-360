const {getCardMetadataAccessor, getHeaderMetadataAccessor, getLoginMetadataAccessor, getLanguagesAccessor, getSideNavMetadataAccessor, getCenterIdsBasedOnUserIdAccessor, getSimcardDetailsAccessor} = require('../../repository-module/data-accesors/metadata-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {mongoWhereInCreator} = require('../../util-module/request-validators');


const getBaseMetadataBusiness = async (req) => {
    let responseObj, headerResponse, sideNavResponse, composedData = {}, request;
    request = [req.body.userId, req.body.lang];
    headerResponse = await getHeaderMetadataAccessor(request);
    sideNavResponse = await getSideNavMetadataAccessor(request);
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

const getCardMetadataForRouteBusiness = async (req) => {
    let responseObj, cardResponse, request;
    request = [req.body.userId, req.body.routeId, req.body.lang];
    cardResponse = await getCardMetadataAccessor(request);
    if (objectHasPropertyCheck(cardResponse, 'rows') && arrayNotEmptyCheck(cardResponse.rows)) {
        let returnObj;
        returnObj = cardResponse.rows.reduce(function (init, item) {
            if (objectHasPropertyCheck(init, 'widgetCards') && !objectHasPropertyCheck(init.widgetCards, item['role_cards_widgets_id'])) {
                const widgetObj = {};
                widgetObj[item['role_cards_widgets_id']] = {};
                init['widgetCards'][item['role_cards_widgets_id']] = {
                    cardId: 'C_' + item['role_card_id'],
                    cardSize: item['card_size'],
                    cardHeader: item['card_header'],
                    cardOrderId: item['card_order_id'],
                    widgets: widgetObj
                }
            }
            if (objectHasPropertyCheck(init['widgetCards'][item['role_cards_widgets_id']], 'widgets') && !objectHasPropertyCheck(init['widgetCards']['widgets'], item['role_cards_widgets_id'])) {
                let widgetAttributesObj = {...init['widgetCards'][item['role_cards_widgets_id']]['widgets'][item['role_cards_widgets_id']].widgetAttributes} || {};
                if (item['widget_type'].toLowerCase() === 'chart') {
                    if (objectHasPropertyCheck(widgetAttributesObj, 'attributeId')) {
                        widgetAttributesObj.colorMap = {...widgetAttributesObj.colorMap, ...{[item['request_mapping_key']]: item['default_value']}}
                    } else {
                        const colorObj = {};
                        colorObj[item['request_mapping_key']] = item['default_value'];
                        widgetAttributesObj = {
                            attributeId: item['role_card_widget_attribute_id'],
                            elementType: item['element_type'],
                            elementSubType: item['sub_type'],
                            colorMap: colorObj
                        }
                    }
                } else {
                    widgetAttributesObj = widgetAttributeSectionCreator(item, widgetAttributesObj);
                }
                init['widgetCards'][item['role_cards_widgets_id']]['widgets'][item['role_cards_widgets_id']] = {
                    widgetId: 'W_' + item['role_cards_widgets_id'],
                    widgetOrderId: item['widget_order_id'],
                    widgetSize: item['widget_size'],
                    widgetType: item['widget_type'],
                    widgetSubType: item['widget_subtype'],
                    widgetAttributes: {...widgetAttributesObj},
                    endpoint: item['endpoint']
                }
            }
            return init;
        }, {widgetCards: {}});
        returnObj.widgetCards = Object.keys(returnObj.widgetCards).map((key) => returnObj.widgetCards[key]);
        returnObj.widgetCards.forEach((item) => {
            item['widgets'] = Object.keys(item.widgets).map((child) => {
                let returnObj = {};
                if (item.widgets[child]['widgetType'].toLowerCase() === 'chart' || item.widgets[child]['widgetType'].toLowerCase() === 'map') {
                    returnObj = item.widgets[child];
                } else {
                    item.widgets[child]['widgetAttributes']['widgetSection'] = Object.keys(item.widgets[child]['widgetAttributes']['widgetSection']).map((section) => {
                        item.widgets[child]['widgetAttributes']['widgetSection'][section]['sectionRows'] = Object.keys(item.widgets[child]['widgetAttributes']['widgetSection'][section]['sectionRows']).map((row) => item.widgets[child]['widgetAttributes']['widgetSection'][section]['sectionRows'][row]);
                        return item.widgets[child]['widgetAttributes']['widgetSection'][section];
                    });
                    returnObj = item.widgets[child];
                }
                return returnObj;
            });
        });
        responseObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', returnObj.widgetCards);
    } else {
        responseObj = fennixResponse(statusCodeConstants.STATUS_NO_CARDS_FOR_USER_ID, 'en', []);
    }
    return responseObj;
};


const getSimCardDetailsBusiness = async (req) => {
    var request = [req.query.userId], centerIds, mongoRequest, response;
    centerIds = await getCenterIdsBasedOnUserIdAccessor(request);
    if (objectHasPropertyCheck(centerIds, 'rows') && arrayNotEmptyCheck(centerIds.rows)) {
        let centerIdsReq = [];
        centerIds.rows.forEach(item => {
            centerIdsReq.push(`${item['location_id']}`);
        });
        mongoRequest = {centerId: mongoWhereInCreator(centerIdsReq)};
        response = await getSimcardDetailsAccessor(mongoRequest);
    }
    return response;
};

const getLoginMetadataBusiness = async (req) => {
    let responseObj, request;
    request = [req.query.active];
    responseObj = await getLoginMetadataAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', responseObj.rows);
};

const getLanguagesListBusiness = async (req) => {
    let responseObj, request;
    request = [req.query.active];
    responseObj = await getLanguagesAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'en', responseObj.rows);
};

//Private methods to modify the data for the way we need in the response
const widgetAttributeSectionCreator = (widgetItem, widgetAttributesObj) => {
    const widgetSectionBaseObj = {
        sectionId: widgetItem['widget_section_order_id'],
        sectionTitle: widgetItem['widget_section_title'],
        sectionType: widgetItem['widget_section_type']
    };
    if (objectHasPropertyCheck(widgetAttributesObj, 'widgetSection')) {
        if (objectHasPropertyCheck(widgetAttributesObj['widgetSection'], widgetItem['widget_section_order_id'])) {
            const sectionRowsOrig = {...widgetAttributesObj['widgetSection'][widgetItem['widget_section_order_id']]['sectionRows']};
            widgetAttributesObj['widgetSection'][widgetItem['widget_section_order_id']] = {
                ...widgetSectionBaseObj,
                sectionRows: widgetAttributeSectionRowCreator(widgetItem, sectionRowsOrig)
            }
        } else {
            widgetAttributesObj['widgetSection'][widgetItem['widget_section_order_id']] = {
                ...widgetSectionBaseObj,
                sectionRows: widgetAttributeSectionRowCreator(widgetItem, {})
            }
        }
    } else {
        widgetAttributesObj['widgetSection'] = {};
        widgetAttributesObj['widgetSection'][widgetItem['widget_section_order_id']] = {
            ...widgetSectionBaseObj,
            sectionRows: widgetAttributeSectionRowCreator(widgetItem, {})
        }
    }
    return widgetAttributesObj;
};

const widgetAttributeSectionRowCreator = (widgetItem, sectionRowsOrig) => {
    let widgetRow = {...sectionRowsOrig} || {};
    if (objectHasPropertyCheck(widgetRow, widgetItem['widget_row_count'])) {
        const originalCol = [...widgetRow[widgetItem['widget_row_count']]['sectionCols']];
        originalCol.push(widgetElementAttributeCreator(widgetItem));
        widgetRow[widgetItem['widget_row_count']] = {
            sectionRowId: widgetItem['widget_row_count'],
            sectionCols: [...originalCol]
        };
    } else {
        widgetRow[widgetItem['widget_row_count']] = {
            sectionRowId: widgetItem['widget_row_count'],
            sectionCols: [widgetElementAttributeCreator(widgetItem)]
        };
    }
    return widgetRow;
};

const widgetElementAttributeCreator = (widgetData) => {
    let widgetElementData = {};
    if (objectHasPropertyCheck(widgetData, 'element_type')) {
        widgetElementData = {
            elementColumnId: widgetData['widget_col_count'],
            attributeId: widgetData['role_card_widget_attribute_id'],
            elementType: widgetData['element_type'],
            elementSubType: widgetData['sub_type'],
            elementIsEditableFlag: widgetData['is_editable'],
            elementIsDisabledFlag: widgetData['disable_flag'],
            onElementChangeAction: widgetData['on_change_action']
        };
        switch (widgetData['element_type'].toLowerCase()) {
            case 'input':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetData['default_value'],
                        defaultKey: widgetData['default_key'],
                        elementTitle: widgetData['element_title'],
                        requestMappingKey: widgetData['request_mapping_key']
                    }
                };
                break;
            case 'checkbox':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetData['default_value'],
                        defaultKey: widgetData['default_key'],
                        elementTitle: widgetData['element_title'],
                        requestMappingKey: widgetData['request_mapping_key'],
                        elementLabel: widgetData['label']
                    }
                };
                break;

            case 'dropdown':
                widgetElementData = {
                    ...widgetElementData, ...{
                        defaultValue: widgetData['default_value'],
                        defaultKey: widgetData['default_key'],
                        elementTitle: widgetData['element_title'],
                        requestMappingKey: widgetData['request_mapping_key'],
                        dropdownEndpoint: widgetData['dropdown_endpoint'],
                        submitEndpoint: widgetData['submit_endpoint'],
                    }
                };
                break;
            case 'button':
                widgetElementData = {
                    ...widgetElementData, ...{
                        submitEndpoint: widgetData['submit_endpoint'],
                        elementLabel: widgetData['label']
                    }
                };
                break;

            case 'chart-color':
                widgetElementData = {
                    ...widgetElementData, ...{['colorMap'[widgetData['mapping_key']]]: widgetData['default_value']}
                }
        }
    }
    return widgetElementData;
};

const routeDataModifier = (arrayResponse) => {
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
                    position: item['route_position'],
                    routeType: item['parent_route_type'],
                    routeHoverTooltip: item['parent_route_hover_tooltip'],
                    routeOrderId: item['route_order_id'],
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
const childRouteCreator = (item) => {
    const childItem = {
        itemId: item['child_route_id'],
        routeId: item['child_route_id'],
        action: item['child_action'],
        icon: item['child_icon'],
        position: item['route_position'],
        routeName: item['child_route_name'],
        routeUrl: item['child_route_url']
    };
    return childItem;
};
module.exports = {
    getBaseMetadataBusiness,
    getCardMetadataForRouteBusiness,
    getSimCardDetailsBusiness,
    getLoginMetadataBusiness,
    // getModalMetadataBusiness,
    // getLoginMetadataBusiness,
    getLanguagesListBusiness
};
