const {imageCounterModel} = require('../models/image-model');

const getDropdownDataQuery = 'select d.dropdown_type, d.dropdown_name, d.dropdown_id\n' +
    '    , ds.dropdown_set_id, ds.dropdown_key, (select localized_text from localization where locale_key = ds.dropdown_value and language = $2) as dropdown_value, ds.is_disable\n' +
    '    , ds.dropdown_action_button_icon_value, ds.dropdown_action_button_icon_key, ds.is_action_button, ds.dropdown_action_button_modal_id\n' +
    '    , dse.endpoint, dse.endpoint_mandatory_request_params, dse.endpoint_request_type\n' +
    '    , r.route_id, r.route_url, r.route_name\n' +
    '    , a.action_name\n' +
    '    from dropdown d\n' +
    '    join dropdown_set ds on d.dropdown_id = ds.dropdown_id and d.dropdown_id = $1\n' +
    '    left outer join endpoints dse on dse.endpoint_id = ds.dropdown_action_button_submit_endpoint\n' +
    '    left outer join route r on r.route_id = dropdown_action_button_route_id \n' +
    '    left outer join action a on a.action_id = ds.on_change_action;\n';

const getDownloadMapperQuery = 'select mapping_key, localized_key from download_mapper';

// const imageCounterUpdateQuery = ()=> {
//     return imageCounterModel.update({$inc: {counter: 1}}).then(doc => {
//         if (!doc) {
//             console.log('error');
//         } else {
//             console.log('success');
//         }
//     });
// };
//
// const fetchImageCounterQuery = ()=> {
//     return imageCounterModel.find();
// };
const fetchImageCounterQuery = ()=> {
    return imageCounterModel.findOneAndUpdate({}, {$inc:{counter:1}});
};
module.exports = {
    getDropdownDataQuery,
    getDownloadMapperQuery,
    fetchImageCounterQuery
};