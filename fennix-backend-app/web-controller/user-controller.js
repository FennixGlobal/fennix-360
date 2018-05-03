var express = require('express');
var userAccessor = require('../repository-module/data-accesors/user-accesor');
var router = express.Router();

/* GET home page. */
router.post('/metadata', function(req, res) {
    var returnObj = {};
    userAccessor.getMetadata(req.body).then((doc, err) => {
        // if (doc !== null && doc !== undefined) {
        //     returnObj = {
        //         status: 200,
        //         message: 'User Metadata available',
        //         data: doc[0].masterdata
        //     }
        // } else {
        //     returnObj = {
        //         status: 611,
        //         message: 'User Metadata unavailable',
        //         data: null
        //     }
        // }

        if (err) {
            console.log(err);
        } else {
            // console.log(res.rows);
            data = JSON.parse(JSON.stringify(doc.rows));
            returnObj = data.reduce(function(init,item){
                var obj = {
                    widget_id:item.widget_id,
                }
                var obj2 = {
                    card_id:item.cardid
                }
                if(init.hasOwnProperty(item.cardid)){
                    debugger;
                    init[item.cardid]['widgets'].push(obj);
                }else {
                    init[item.cardid] = obj2;
                    init[item.cardid]['widgets'] = [obj];
                }
                return init;
            },{});
            console.log(data);
            console.log(returnObj);
        }

        res.send(returnObj);
    })
});

// router.post('/metadata', function(req, res) {
//     var returnObj = {};
//     userAccessor.getMetadata(req.body).then((doc) => {
//         if (doc !== null && doc !== undefined) {
//             returnObj = {
//                 status: 200,
//                 message: 'User Metadata available',
//                 data: doc[0].masterdata
//             }
//         } else {
//             returnObj = {
//                 status: 611,
//                 message: 'User Metadata unavailable',
//                 data: null
//             }
//         }
//         res.send(returnObj);
//     })
// });
module.exports = router;