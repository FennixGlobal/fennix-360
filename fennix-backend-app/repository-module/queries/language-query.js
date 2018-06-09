const selectLanguagesQuery = 'select language_id, language_name, iso_code from languages where isactive = $1';

module.exports = {
    selectLanguagesQuery
};