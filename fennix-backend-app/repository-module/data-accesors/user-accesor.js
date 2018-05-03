// var MetaData = require('../models/userpreferences-model');
//
// module.exports.getMetadata = (req) => {
//     return MetaData.find({"emailId": req.emailId});
// };
// //


var pg = require('pg');
const client = new pg.Client('postgres://postgres:postgres@localhost:5432/fennix_dev_db');
client.connect();
module.exports.getMetadata = (req) => {

    return client.query('select distinct u.user_id, c.card_size, uc.cardid, uc.card_header_id, uc.order_id as card_order,\n' +
        'ucw.widget_id, ucw.order_id as widget_order_id, ucw.endpoint, ws.widget_size, \n' +
        'ucw.widget_subtype_id, w.widget_type, wst.widget_subtype\n' +
        '-- ,sn.nav_id, sn.route_api, sn.route_name, sn.route_url\n' +
        'from users u\n' +
        'join user_cards uc on u.user_id = uc.userid\n' +
        'join cards c on uc.cardid = c.card_id\n' +
        'join user_cards_widgets ucw on ucw.user_card_id = uc.user_card_id\n' +
        'join widgets w on w.widget_id = ucw.widget_id\n' +
        'join widget_size ws on ws.widget_size_id = ucw.widget_size_id\n' +
        'join widget_subtype wst on wst.widget_subtype_id = ucw.widget_subtype_id');

    // return b;
};
// const query =



