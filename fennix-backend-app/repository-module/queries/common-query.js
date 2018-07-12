const getDropdownDataQuery = 'select d.dropdown_type, d.dropdown_name, d.dropdown_id\n' +
    ', ds.dropdown_set_id, ds.dropdown_key, (select localized_text from localization where locale_key = ds.dropdown_value and language = $2) as dropdown_value, ds.is_disable\n' +
    'from dropdown d\n' +
    'join dropdown_set ds on d.dropdown_id = ds.dropdown_id and d.dropdown_id = $1';

const getDownloadMapperQuery = 'select mapping_key, localized_key from download_mapper';

module.exports = {
    getDropdownDataQuery,
    getDownloadMapperQuery
};