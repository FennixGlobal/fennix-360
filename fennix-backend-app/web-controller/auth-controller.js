var express = require('express');
var authAccesor = require('../repository-module/data-accesors/auth-accesor');
var router = express.Router();
var app = express();

/* GET home page. */
router.post('/', function (req, res) {
    var returnObj = {};
    authAccesor.getUserDetails(req.body).then((doc) => {
        if (doc !== null && doc !== undefined) {
            returnObj = {
                status: 200,
                message: 'User Found',
                data: doc.userDetails
            }
        } else {
            returnObj = {
                status: 610,
                message: 'User not Found',
                data: null
            }
        }
        res.send(returnObj);
    })
});

module.exports = router;