const cardWidgetMetadataQuery = 'select u.user_id\n' +
    ', c.card_size\n' +
    ', rc.card_order_id, rc.role_card_id\n' +
    ', (select localized_text from localization where language = $3 and locale_key = rc.card_header_localization_key) as card_header\n' +
    ', rcw.widget_order_id, rcw.role_cards_widgets_id\n' +
    ', w.widget_type\n' +
    ', ws.widget_subtype\n' +
    ', wsize.widget_size\n' +
    ', e.endpoint\n' +
    'from users u\n' +
    'join role_cards rc on u.user_role = rc.role_id and u.user_role = $1\n' +
    'join cards c on c.card_id = rc.card_size_id\n' +
    'join role_cards_widgets rcw on rcw.role_card_id = rc.role_card_id and rcw.route_id = $2\n' +
    'join widgets w on w.widget_id = rcw.widget_type_id\n' +
    'join widget_subtype ws on ws.widget_subtype_id = rcw.widget_subtype_id\n' +
    'join widget_size wsize on wsize.widget_size_id = rcw.widget_size_id\n' +
    'join endpoints e on e.endpoint_id = rcw.endpoint_id';

const headerMetadataQuery = 'select u.user_id\n' +
    ', rh.header_id\n' +
    ', r.route_url as parent_route_url, r.route_api as parent_route_api\n' +
    ', (select localized_text from localization where language = $2 and locale_key = r.route_name) as parent_route_name\n' +
    ', r.route_id as parent_route_id, r.icon as parent_icon, r.position as parent_position\n' +
    ', chr.route_id as child_route_id, chr.route_api as child_route_api\n' +
    ',(select localized_text from localization where language = $2 and locale_key = chr.route_name) as child_route_name\n' +
    ', chr.route_url as child_route_url\n' +
    ', chr.icon as child_icon, chr.position as child_position\n' +
    ', a.action_name as parent_action\n' +
    ', ca.action_name as child_action\n' +
    ' from users u\n' +
    'join role_headers rh on u.user_role = rh.role_id and u.user_role = $1\n' +
    'join headers h on h.header_id = rh.header_id\n' +
    'join route r on r.route_id = h.route_id\n' +
    'left outer join route chr on chr.parent_id = r.route_id\n' +
    'left outer join action a on a.action_id = r.action\n' +
    'left outer join action ca on ca.action_id = chr.action';

const sideNavMetadataQuery = 'select u.user_id\n' +
    ', r.route_url as parent_route_url, r.route_api as parent_route_api\n' +
    ',(select localized_text from localization where language = $2 and locale_key = r.route_name)  as parent_route_name\n' +
    ', r.route_id as parent_route_id, r.icon as parent_icon\n' +
    ', chr.route_id as child_route_id, chr.route_api as child_route_api\n' +
    ',(select localized_text from localization where language = $2 and locale_key = chr.route_name)  as child_route_name\n' +
    ', chr.route_url as child_route_url\n' +
    ', chr.icon as child_icon\n' +
    ', a.action_name as parent_action\n' +
    ', ca.action_name as child_action\n' +
    ', rs.sidenav_order_id\n' +
    'from users u\n' +
    'join role_sidenavs rs on rs.role_id = u.user_role and u.user_role=$1\n' +
    'join sidenavs s on s.nav_id = rs.sidenav_id\n' +
    'join route r on r.route_id = s.route_id\n' +
    'left outer join route chr on chr.parent_id = r.route_id\n' +
    'left outer join action a on a.action_id = r.action\n' +
    'left outer join action ca on ca.action_id = chr.action';

module.exports = {
    headerMetadataQuery,
    sideNavMetadataQuery,
    cardWidgetMetadataQuery
};