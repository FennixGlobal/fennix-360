const addCompanyQuery = 'insert into ';
const listCompanyQuery = 'select company_id, company_name, customs_id, (select localized_text from localization where language = $1 and locale_key = (select dropdown_value from dropdown_set where dropdown_set_id = c.company_type)) as company_type from company c where owner_user_id = $2';

module.exports = {
    addCompanyQuery,
    listCompanyQuery
};
