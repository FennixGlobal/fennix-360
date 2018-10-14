var express = require('express');
const LiteUser = require('../repository-module/models/lite-user-model')
var router = express.Router();


router.get("/liteUsers", (req, res) => {
    console.log("query", req.query);
    
    LiteUser.find(req.body, (err, data) => {
        if(err){
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
        return;
    });
});

router.post("/liteUser", (req, res) => {
    console.log("body", req.body);
    LiteUser.save( (err, data) => {
        if(err){
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
        return;
    });
});



module.exports = router;