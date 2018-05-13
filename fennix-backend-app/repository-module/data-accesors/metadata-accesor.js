const {cardWidgetMetadataQuery,headerMetadataQuery,sideNavMetadataQuery} = require('../queries/metadata-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

var getCardMetadata = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, cardWidgetMetadataQuery);
    return returnObj;
};
var getSideNavMetadata = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, sideNavMetadataQuery);
    return returnObj;
};
var getHeaderMetadata = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, headerMetadataQuery);
    return returnObj;
};
module.exports = {
    getCardMetadata,
    getSideNavMetadata,
    getHeaderMetadata
};
//     .getMetadata = (req) => {
//     return client.query('select u.user_id,  uc.cardid, uc.card_header_id, uc.order_id as card_order\n' +
//         ',c.card_size, uc.user_card_id, ucw.user_card_widget_id\n' +
//         ',ucw.widget_id, ucw.order_id as widget_order_id, ucw.route_id, ws.widget_size\n' +
//         ', ucw.widget_subtype_id, w.widget_type, wst.widget_subtype\n' +
//         ', r.route_url, r.route_api, r.route_name\n' +
//         'from users u \n' +
//         'join user_cards uc on u.user_id = uc.userid and u.email_id = $1\n' +
//         'join cards c on uc.cardid = c.card_id\n' +
//         'join user_cards_widgets ucw on ucw.user_card_id = uc.user_card_id\n' +
//         'join widgets w on w.widget_id = ucw.widget_id\n' +
//         'join widget_size ws on ws.widget_size_id = ucw.widget_size_id\n' +
//         'join widget_subtype wst on wst.widget_subtype_id = ucw.widget_subtype_id\n' +
//         'join route r on r.route_id = ucw.route_id', [req.body]);
//
//
//     // },
//     // return MetaData.find({"emailId": req.emailId});
// };
// module.exports = {
//     cardMetadata: (req) => {
//         return MetaData.find({"emailId": req.emailId})
//     },
// cardMetadata : (req) => {
//     client.query('select u.user_id, uc.cardid, uc.card_header_id, uc.order_id as card_order\n' +
//         ',c.card_size, uc.user_card_id, ucw.user_card_widget_id\n' +
//         ',ucw.widget_id, ucw.order_id as widget_order_id, ucw.endpoint, ws.widget_size, \n' +
//         'ucw.widget_subtype_id, w.widget_type, wst.widget_subtype\n' +
//         'from users u\n' +
//         'join user_cards uc on u.user_id = uc.userid and u.email_id = $1\n' +
//         'join cards c on uc.cardid = c.card_id\n' +
//         'join user_cards_widgets ucw on ucw.user_card_id = uc.user_card_id\n' +
//         'join widgets w on w.widget_id = ucw.widget_id\n' +
//         'join widget_size ws on ws.widget_size_id = ucw.widget_size_id\n' +
//         'join widget_subtype wst on wst.widget_subtype_id = ucw.widget_subtype_id', [req.emailId]);
//     },
//     headerMetadata: (req) => {
//         return client.query('select u.user_id, h.header_id, h.action, h.endpoint, h.position, h.icon\n' +
//             'from users u \n' +
//             'join user_headers uh on uh.user_id = u.user_id and u.email_id = $1\n' +
//             'join headers h on h.header_id = uh.header_id', [req.emailId]);
//     },
//     sideNavMetadata: (req) => {
//         return client.query('select u.user_id, sn.nav_id, sn.route_api, sn.route_name, sn.route_url \n' +
//             'from users u\n' +
//             'join user_sidenavs usn on usn.user_id = u.user_id and u.email_id = $1\n' +
//             'join sidenavs sn on sn.nav_id = usn.sidenav_id', [req.emailId]);
//     }
// };
// };

