var express = require('express');
var userAccessor = require('../repository-module/data-accesors/user-accesor');
var router = express.Router();

/* GET home page. */
router.post('/metadata', function(req, res) {
    var returnObj = {};
    userAccessor.getMetadata(req.body).then((doc) => {
        if (doc !== null && doc !== undefined) {
            returnObj = {
                status: 200,
                message: 'User Metadata available',
                data: doc[0].masterdata
            }
        } else {
            returnObj = {
                status: 611,
                message: 'User Metadata unavailable',
                data: null
            }
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