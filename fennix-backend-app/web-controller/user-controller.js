var express = require('express');
var userAccessor = require('../repository-module/data-accesors/user-accesor');
var router = express.Router();

/* GET home page. */
router.post('/metadata', function(req, res) {
    var returnObj = {};
    userAccessor.getMetadata(req.body).then((doc, err) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(JSON.stringify(doc.rows));
            returnObj = data.reduce(function(init,item){
                var user = {
                    userId:item.user_id
                };
                var widgetObj = {
                    widget_id:'W_'+item.widget_id,
                    widget_orderId:item.widget_order_id,
                    widget_size:item.widget_size,
                    widget_type:item.widget_type,
                    widget_subType:item.widget_subtype,
                    endpoint:item.endpoint
                };
                var cardObj = {
                    card_id:'C_'+item.cardid,
                    card_size:item.card_size,
                    card_headerId:item.card_header_id,
                    card_orderId:item.card_order
                };
                if(init.hasOwnProperty('userId') && init.userId !== null && init['cards'] !== null){
                    if(init['cards'].hasOwnProperty(cardObj.card_id)){
                        init['cards'][cardObj.card_id]['widgets'].push(widgetObj);
                    } else {
                        cardObj['widgets'] = [widgetObj];
                        init['cards'][cardObj.card_id] = cardObj;
                    }
                } else {
                    init = user;
                    cardObj['widgets'] = [];
                    init['cards'] = {};
                    cardObj['widgets'].push(widgetObj);
                    init['cards'][cardObj.card_id] = cardObj;
                }
                return init;
            },{});
        }
returnObj.cards = Object.keys(returnObj.cards).map((key)=>returnObj.cards[key]);
        res.send(returnObj);
    })
});

module.exports = router;