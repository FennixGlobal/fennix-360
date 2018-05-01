var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var masterSchema = new Schema({
    userId: {Type: String},
    emailId: {Type: String},
    masterdata: {
        sideNav: [
            {
                navId: {Type: String},
                routeURL: {Type: String},
                routeAPI: {Type: String},
                routeName: {Type: String}
            }
        ],
        mainBody: {
            columnCount: {Type: Number},
            rowCount: {Type: Number},
            pageTitle: {Type: String},
            cards: [
                {
                    cardId: {Type: Number},
                    order: {Type: Number},
                    cardHeader: {Type: String},
                    cardSize: {Type: String},
                    widgets: [
                        {
                            widgetId: {Type: String},
                            order: {Type: String},
                            widgetType: {Type: String},
                            widgetSize: {Type: String},
                            widgetAttributes: {
                                widgetSubType: {Type: String},
                                endpoint: {Type: String}
                            }
                        }
                    ]
                }
            ]
        }
    }
});

module.exports = mongoose.model('MasterData', masterSchema, 'masterData');