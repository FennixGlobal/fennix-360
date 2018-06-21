const cardWidgetMetadataQuery = 'select u.user_id \n' +
    '    , (select card_size from cards c where c.card_id = rc.card_size_id) as card_size\n' +
    '    , rc.card_order_id,rc.role_card_id\n' +
    '    , (select localized_text from localization where locale_key = rc.card_header_localization_key and language = $3) as card_header\n' +
    '    , (select widget_type from widgets where widget_id = rcwa.widget_section_type) as widget_section_type\n' +
    '    , rcw.widget_order_id,rcw.role_cards_widgets_id\n' +
    '    , we.endpoint as widget_endpoint, we.endpoint_initial_sort as widget_init_sort, we.endpoint_mandatory_request_params as widget_req_params, we.endpoint_request_type as widget_req_type\n' +
    '    , (select widget_size from widget_size where widget_size_id = rcw.widget_size_id) as widget_size\n' +
    '    , (select widget_subtype from widget_subtype where widget_subtype_id = rcwa.widget_section_subtype) as widget_section_subtype\n' +
    '    , rcwa.request_mapping_key, rcwa.default_key__accent_value, rcwa.default_value__hover_value, rcwa.disable_flag, rcwa.is_editable__sort\n' +
    '    , rcwa.widget_col_count, rcwa.widget_row_count, rcwa.element_primary_value__validation, rcwa.element_secondary_value__async_validation\n' +
    '    , rcwa.element_icon_value, rcwa.widget_section_order_id, rcwa.widget_attribute_type\n' +
    '    , rcwa.widget_sub_section_type,rcwa.widget_sub_section_order_id,rcwa.element_modal_id\n' +
    '    , (select localized_text from localization where locale_key = rcwa.element_title and language = $3) as element_title\n' +
    '    , (select localized_text from localization where locale_key = rcwa.element_label and language = $3) as element_label\n' +
    '    , (select localized_text from localization where locale_key = rcwa.widget_section_title and language = $3) as widget_section_title\n' +
    '    ,(select localized_text from localization where locale_key = rcwa.widget_sub_section_title and language = $3) as widget_sub_section_title\n' +
    '    , de.endpoint as dropdown_endpoint, se.endpoint as submit_endpoint\n' +
    '    , (select action_name from action where action_id = rcwa.on_change_action) as element_action_type\n' +
    '    , wa.element_type, wa.sub_type as element_subtype\n' +
    '    , rn.route_url\n' +
    '    from users u\n' +
    '    join roles r on r.role_id = u.user_role and u.user_id = $1\n' +
    '    join role_cards rc on rc.role_id = u.user_role\n' +
    '    or rc.group_role_id = r.role_group_id\n' +
    '    join role_cards_widgets rcw\n' +
    '    on rcw.role_card_id = rc.role_card_id and rcw.route_id = $2\n' +
    '    join role_card_widget_attribute rcwa\n' +
    '    on rcwa.role_card_widget_id = rcw.role_cards_widgets_id\n' +
    '    join widget_attributes wa on wa.widget_attribute_id = rcwa.widget_attribute_id\n' +
    '    left outer join endpoints de on de.endpoint_id = rcwa.dropdown_endpoint\n' +
    '    left outer join endpoints se on se.endpoint_id = rcwa.submit_endpoint\n' +
    '    left outer join route rn on rn.route_id = rcwa.navigation_route\n' +
    '    left outer join endpoints we on we.endpoint_id = rcw.endpoint_id';

const headerMetadataQuery = 'select u.user_id\n' +
    '    , rh.header_id as route_id, rh.header_order_id as route_order_id,rh.header_route_position as route_position\n' +
    '    , r.route_url as parent_route_url, r.route_type as parent_route_type, r.route_sub_type as parent_route_subtype\n' +
    '    , r.route_action as parent_route_action\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = r.route_hover_tooltip) as parent_route_hover_tooltip\n' +
    '    , r.modal_id as parent_route_modal_id\n' +
    '    , r.route_submit_endpoint as parent_route_submit_endpoint\n' +
    '    , r.route_data_endpoint as parent_route_data_endpoint\n' +
    '    , (select localized_text from localization where language = $2 and locale_key = r.route_name) as parent_route_name\n' +
    '    , r.route_id as parent_route_id, r.route_icon as parent_icon\n' +
    '    , chr.route_id as child_route_id\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = chr.route_name) as child_route_name\n' +
    '    , chr.route_url as child_route_url\n' +
    '    , chr.route_icon as child_icon\n' +
    '    , chr.route_type as child_route_type, chr.route_sub_type as child_route_subtype\n' +
    '    , chr.route_action as child_route_action\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = chr.route_hover_tooltip) as child_route_hover_tooltip\n' +
    '    ,chr.modal_id as child_route_modal_id\n' +
    '    , chr.route_submit_endpoint as child_route_submit_endpoint\n' +
    '    , chr.route_data_endpoint as child_route_data_endpoint\n' +
    '    , a.action_name as parent_action\n' +
    '    , ca.action_name as child_action\n' +
    '    from users u\n' +
    '    join roles ro on ro.role_id = u.user_role and u.user_id = $1\n' +
    '    join role_headers rh on rh.role_id = u.user_role\n' +
    '    or rh.group_role_id = ro.role_group_id\n' +
    '    join headers h on h.header_id = rh.header_id\n' +
    '    join route r on r.route_id = h.route_id\n' +
    '    left outer join route chr on chr.route_parent_id = r.route_id\n' +
    '    left outer join action a on a.action_id = r.route_action\n' +
    '    left outer join action ca on ca.action_id = chr.route_action';

const sideNavMetadataQuery = 'select u.user_id\n' +
    '    , r.route_url as parent_route_url, r.route_type as parent_route_type, r.route_sub_type as parent_route_subtype\n' +
    '    , r.route_action as parent_route_action\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = r.route_hover_tooltip) as parent_route_hover_tooltip\n' +
    '    , r.modal_id as parent_route_modal_id\n' +
    '    , r.route_submit_endpoint as parent_route_submit_endpoint\n' +
    '    , r.route_data_endpoint as parent_route_data_endpoint\n' +
    '    , (select localized_text from localization where language = $2 and locale_key = r.route_name) as parent_route_name\n' +
    '    , r.route_id as parent_route_id, r.route_icon as parent_icon\n' +
    '    , chr.route_id as child_route_id\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = chr.route_name) as child_route_name\n' +
    '    , chr.route_url as child_route_url\n' +
    '    , chr.route_icon as child_icon\n' +
    '    , chr.route_type as child_route_type, chr.route_sub_type as child_route_subtype\n' +
    '    , chr.route_action as child_route_action\n' +
    '    ,(select localized_text from localization where language = $2 and locale_key = chr.route_hover_tooltip) as child_route_hover_tooltip\n' +
    '    ,chr.modal_id as child_route_modal_id\n' +
    '    , chr.route_submit_endpoint as child_route_submit_endpoint\n' +
    '    , chr.route_data_endpoint as child_route_data_endpoint\n' +
    '    , a.action_name as parent_action\n' +
    '    , ca.action_name as child_action\n' +
    '    , rs.sidenav_order_id as route_order_id\n' +
    '    from users u\n' +
    '    join roles ro on ro.role_id = u.user_role and u.user_id = $1\n' +
    '    join role_sidenavs rs on rs.role_id = u.user_role\n' +
    '    or rs.group_role_id = ro.role_group_id\n' +
    '    join sidenavs s on s.nav_id = rs.sidenav_id\n' +
    '    join route r on r.route_id = s.route_id\n' +
    '    left outer join route chr on chr.route_parent_id = r.route_id\n' +
    '    left outer join action a on a.action_id = r.route_action\n' +
    '    left outer join action ca on ca.action_id = chr.route_action;\n';

const loginMetadataQuery = 'select rcwa.role_card_widget_attribute_id\n' +
    ', (select localized_text from localization where locale_key = rcwa.element_title and language = \'EN_US\') as element_title\n' +
    ', (select localized_text from localization where locale_key = rcwa.element_label and language = \'EN_US\') as element_label\n' +
    ', se.endpoint as submit_endpoint,se.endpoint_mandatory_request_params as submit_req_params,se.endpoint_request_type as submit_req_type\n' +
    ', de.endpoint as dropdown_endpoint,de.endpoint_mandatory_request_params as dropdown_req_params,de.endpoint_request_type as dropdown_req_type\n' +
    ',wis.element_type ,wis.sub_type as element_subtype\n' +
    ',rcwa.request_mapping_key\n' +
    ', (select widget_subtype from widget_subtype where widget_subtype_id = rcwa.widget_section_subtype) as widget_sub_section_type\n' +
    ',rcwa.widget_sub_section_order_id\n' +
    ',rcwa.disable_flag,rcwa.default_key__accent_value,rcwa.default_value__hover_value,rcwa.is_editable__sort\n' +
    ', a.action_name\n' +
    ',rcwa.widget_section_order_id,rcwa.widget_section_title\n' +
    ', (select widget_type from widgets where widget_id = rcwa.widget_section_type) as widget_section_type\n' +
    ',rcwa.widget_col_count,rcwa.widget_row_count\n' +
    'from role_card_widget_attribute rcwa\n' +
    'left join widget_attributes wis on\n' +
    'rcwa.widget_attribute_id = wis.widget_attribute_id\n' +
    'join role_cards_widgets rcw\n' +
    'on rcwa.role_card_widget_id = 11\n' +
    'join role_cards rc \n' +
    'on rcw.role_card_id = rc.role_card_id and rc.card_header_localization_key = \'LOGIN\'\n' +
    'left join endpoints se \n' +
    'on se.endpoint_id = rcwa.submit_endpoint\n' +
    'left join endpoints de\n' +
    'on de.endpoint_id = rcwa.dropdown_endpoint\n' +
    'left join action a \n' +
    'on a.action_id = rcwa.on_change_action';

const modalMetadataQuery = 'select m.modal_id, ma.modal_attribute_id, ma.modal_parent_type\n' +
    '    , ma.modal_attribute_position\n' +
    '    , (select localized_text from localization where locale_key = ma.modal_element_name and language = $2) as modal_element_name\n' +
    '    , (select localized_text from localization where locale_key = m.modal_header_name and language = $2) as modal_header_name\n' +
    '    , ma.modal_section, ma.modal_row_count, ma.modal_col_count \n' +
    '    , de.endpoint as data_endpoint\n' +
    '    , wa.element_type, wa.sub_type\n' +
    '    , e.endpoint as submit_endpoint\n' +
    '    , a.action_name\n' +
    '    from modal m\n' +
    '    join modal_attributes ma\n' +
    '    on m.modal_id = ma.modal_id and m.modal_id = $1\n' +
    '    join widget_attributes wa \n' +
    '    on wa.widget_attribute_id = ma.modal_element_type\n' +
    '    left outer join endpoints e\n' +
    '    on e.endpoint_id = ma.modal_submit_endpoint\n' +
    '    left outer join action a\n' +
    '    on a.action_id = ma.modal_element_action\n' +
    '    left outer join endpoints de\n' +
    '    on de.endpoint_id = ma.modal_data_endpoint';

const getRoleQuery = 'select role_id, (select localized_text from localization where locale_key = r.role_name and language = $1) as role_name from roles r';

module.exports = {
    headerMetadataQuery,
    sideNavMetadataQuery,
    cardWidgetMetadataQuery,
    loginMetadataQuery,
    getRoleQuery,
    modalMetadataQuery
};
