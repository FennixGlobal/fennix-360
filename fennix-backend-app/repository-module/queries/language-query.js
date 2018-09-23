//TODO: ordering based on languageId as of now as it doesn't have any date field
const selectLanguagesQuery = 'select * from languages where isactive = true order by language_id offset $1 limit $2';

const getTotalNoOfLanguagesQuery = 'select count(*) from languages where isactive = true';

module.exports = {
    selectLanguagesQuery,
    getTotalNoOfLanguagesQuery
};