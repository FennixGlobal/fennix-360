const cardWidgetMetadataQuery = 'select u.user_id\n' +
    '    , c.card_size\n' +
    '    , rc.card_order_id, rc.role_card_id\n' +
    '    , (select localized_text from localization where language = $3 and locale_key = rc.card_header_localization_key) as card_header\n' +
    '    , rcw.widget_order_id, rcw.role_cards_widgets_id, rcw.route_id\n' +
    '    , w.widget_type\n' +
    '    , ws.widget_subtype\n' +
    '    , wsize.widget_size\n' +
    '    , e.endpoint\n' +
    '    , rcwa.role_card_widget_attribute_id, rcwa.request_mapping_key, rcwa.default_key, rcwa.default_value\n' +
    '    , rcwa.element_title, rcwa.dropdown_endpoint, rcwa.submit_endpoint,rcwa.widget_section_order_id,rcwa.widget_section_type,rcwa.widget_col_count\n' +
    '    , rcwa.label, rcwa.on_change_action, rcwa.is_editable,rcwa.disable_flag,rcwa.widget_section_title,rcwa.widget_row_count\n' +
    '    , wa.element_type, wa.sub_type\n' +
    '    from users u\n' +
    '    join roles r on r.role_id = u.user_role and u.user_id = $1\n' +
    '    join role_cards rc on rc.group_role_id = r.role_group_id \n' +
    '    or rc.role_id = r.role_id\n' +
    '    join cards c on c.card_id = rc.card_size_id\n' +
    '    join role_cards_widgets rcw on rcw.role_card_id = rc.role_card_id and rcw.route_id = $2\n' +
    '    left join widgets w on w.widget_id = rcw.widget_type_id\n' +
    '    left join widget_subtype ws on ws.widget_subtype_id = rcw.widget_subtype_id\n' +
    '    left join widget_size wsize on wsize.widget_size_id = rcw.widget_size_id\n' +
    '    join endpoints e on e.endpoint_id = rcw.endpoint_id\n' +
    '    left join role_card_widget_attribute rcwa on rcwa.role_card_widget_id = rcw.role_cards_widgets_id\n' +
    '    left join widget_attributes wa on wa.widget_attribute_id = rcwa.widget_attribute_id;\n';

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
    '    left outer join action ca on ca.action_id = chr.route_action;\n';

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
    ', (select localized_text from localization where locale_key = rcwa.label and language = \'EN_US\') as label\n' +
    ', se.endpoint as submit_endpoint\n' +
    ', de.endpoint as dropdown_endpoint\n' +
    ',wis.element_type ,wis.sub_type\n' +
    ',rcwa.request_mapping_key\n' +
    ',rcwa.disable_flag,rcwa.default_key,rcwa.default_value,rcwa.is_editable\n' +
    ', a.action_name\n' +
    ',rcwa.widget_section_order_id,rcwa.widget_section_title,rcwa.widget_section_type,rcwa.widget_col_count,rcwa.widget_row_count,rcwa.widget_section_order_id\n' +
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

const modalMetadataQuery = '';

module.exports = {
    headerMetadataQuery,
    sideNavMetadataQuery,
    cardWidgetMetadataQuery,
    loginMetadataQuery
};
