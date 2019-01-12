const addCompanyQuery = 'insert into ';
const listCompanyQuery = 'select company_id, company_name, customs_id, (select localized_text from localization where language = $1 and locale_key = (select dropdown_value from dropdown_set where dropdown_set_id = c.company_type)) as company_type from company c where owner_user_id = $2 order by updated_date desc nulls last offset $3 limit $4';
const getCompanyDetailsQuery = 'select company_id, company_name, customs_id, company_address, company_phone, company_email, company_state, company_city, company_country, (select localized_text from localization where language = $1 and locale_key = (select dropdown_value from dropdown_set where dropdown_set_id = c.company_type)) as company_type from company where company_id IN ';
module.exports = {
    addCompanyQuery,
    getCompanyDetailsQuery,
    listCompanyQuery
};
